import { Parser } from "htmlparser2";
import { HTML_MAX_BYTES, type DoctorCheck, type DoctorReport } from "./doctor";

/** Parse tokens only: never mount a DOM, run scripts or retrieve resources. */
export function inspectHtml(html: string): DoctorReport {
  if (typeof html !== "string" || html.length > HTML_MAX_BYTES)
    throw new Error("HTML je omejen na 500 KiB.");
  const bytes = new TextEncoder().encode(html).length;
  if (bytes > HTML_MAX_BYTES) throw new Error("HTML je omejen na 500 KiB.");
  const stack: string[] = [];
  const ignored = new Set([
    "script",
    "style",
    "template",
    "noscript",
    "svg",
    "math",
  ]);
  let ignoredDepth = 0;
  let elements = 0;
  let htmlCount = 0;
  let headCount = 0;
  let bodyCount = 0;
  let language = "";
  const titles: string[] = [];
  const descriptions: string[] = [];
  const viewports: string[] = [];
  const canonicals: string[] = [];
  const robots: string[] = [];
  const social = new Set<string>();
  const levels: number[] = [];
  let images = 0;
  let missingAlt = 0;
  let emptyAlt = 0;
  let charset = false;
  const parser = new Parser(
    {
      onopentag(name, attrs) {
        if (++elements > 30_000 || stack.length > 256)
          throw new Error("HTML je preveč zapleten. Uporabi manjši dokument.");
        stack.push(name);
        if (ignored.has(name)) ignoredDepth++;
        if (ignoredDepth) return;
        if (name === "html") {
          htmlCount++;
          language = attrs.lang?.trim() ?? "";
        }
        if (name === "head") headCount++;
        if (name === "body") bodyCount++;
        const inHead = stack.includes("head");
        if (inHead && name === "title") titles.push("");
        if (inHead && name === "meta") {
          const key = attrs.name?.toLowerCase().trim();
          const content = attrs.content?.trim() ?? "";
          if (key === "description") descriptions.push(content);
          if (key === "viewport") viewports.push(content.toLowerCase());
          if (key === "robots" || key === "googlebot")
            robots.push(content.toLowerCase());
          if (attrs.charset?.toLowerCase() === "utf-8") charset = true;
          if (attrs.property && content)
            social.add(attrs.property.toLowerCase());
        }
        if (
          inHead &&
          name === "link" &&
          attrs.rel?.toLowerCase().split(/\s+/).includes("canonical")
        )
          canonicals.push(attrs.href?.trim() ?? "");
        if (stack.includes("body")) {
          if (/^h[1-6]$/.test(name)) levels.push(Number(name[1]));
          if (name === "img") {
            images++;
            if (!("alt" in attrs)) missingAlt++;
            else if (!attrs.alt.trim()) emptyAlt++;
          }
        }
      },
      ontext(text) {
        if (!ignoredDepth && stack.at(-1) === "title" && titles.length)
          titles[titles.length - 1] += text;
      },
      onclosetag(name) {
        const index = stack.lastIndexOf(name);
        if (index < 0) return;
        for (const closed of stack.splice(index))
          if (ignored.has(closed)) ignoredDepth--;
      },
    },
    { decodeEntities: true },
  );
  parser.end(html);
  if (htmlCount !== 1 || headCount !== 1 || bodyCount !== 1)
    throw new Error(
      "Prilepi celoten dokument z oznakami html, head in body, ne samo povezave ali odlomka.",
    );
  const checks: DoctorCheck[] = [];
  function add(
    id: string,
    title: string,
    pass: boolean,
    detail: string,
    action: string,
  ) {
    checks.push({
      id,
      title,
      status: pass ? "pass" : "review",
      detail,
      action,
    });
  }
  const title = titles[0]?.trim() ?? "";
  add(
    "title",
    "Naslov strani",
    titles.length === 1 && !!title,
    `Oznake title: ${titles.length}. Dolžina prvega naslova: ${Array.from(title).length} znakov.`,
    "Uporabi en jasen, za to stran značilen naslov. Dolžina sama ne določa kakovosti ali uvrstitve.",
  );
  add(
    "description",
    "Opis za iskalnike",
    descriptions.length === 1 && !!descriptions[0],
    `Opisi: ${descriptions.length}. Dolžina prvega opisa: ${Array.from(descriptions[0] ?? "").length} znakov.`,
    "Dodaj en uporaben opis vsebine. Iskalnik lahko v rezultatih uporabi drugo besedilo.",
  );
  add(
    "language",
    "Jezik dokumenta",
    /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(language),
    language
      ? "Oznaka jezika je prisotna; preverjena je samo osnovna oblika."
      : "Jezik na oznaki html manjka.",
    'Nastavi veljaven jezik vsebine, na primer lang="sl". Pravilnost jezika preveri ročno.',
  );
  const h1 = levels.filter((level) => level === 1).length;
  add(
    "h1",
    "Glavni naslov H1",
    h1 === 1,
    `Najdenih naslovov H1: ${h1}.`,
    "Za jasno strukturo priporočamo en glavni naslov. Več naslovov H1 samo po sebi ni dokaz napake dostopnosti.",
  );
  const skipped = levels.some(
    (level, index) => index > 0 && level > levels[index - 1] + 1,
  );
  add(
    "headings",
    "Zaporedje naslovov",
    levels.length > 0 && !skipped,
    skipped
      ? "V zaporedju je preskočena raven naslova, na primer H1 → H3."
      : `Najdenih naslovov: ${levels.length}. Preskokov med njimi ni.`,
    "Naslove organiziraj po vsebini, ne po velikosti pisave. Vidnost in pomen preveri ročno.",
  );
  const viewport = viewports[0] ?? "";
  const zoomBlocked =
    /user-scalable\s*=\s*(?:no|0)(?:\s*[,;]|\s*$)/.test(viewport) ||
    [...viewport.matchAll(/maximum-scale\s*=\s*([\d.]+)/g)].some(
      (match) => Number(match[1]) < 2,
    );
  add(
    "viewport",
    "Mobilna nastavitev",
    viewports.length === 1 &&
      /(?:^|[,;])\s*width\s*=\s*device-width\s*(?:[,;]|$)/.test(viewport) &&
      !zoomBlocked,
    zoomBlocked
      ? "Nastavitev viewport omejuje povečavo."
      : `Oznake viewport: ${viewports.length}.`,
    "Uporabi width=device-width in omogoči povečavo. To še ne potrjuje odzivnosti strani.",
  );
  let canonicalValid = false;
  try {
    const url = new URL(canonicals[0]);
    canonicalValid =
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.hash;
  } catch {
    /* Missing or relative URL needs review. */
  }
  add(
    "canonical",
    "Prednostni naslov strani",
    canonicals.length === 1 && canonicalValid,
    `Oznake canonical: ${canonicals.length}. Preverjena je oblika povezave, ne njen cilj.`,
    "Preveri, da ena absolutna povezava canonical kaže na pravo prednostno stran.",
  );
  const noindex = robots.some((value) =>
    /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/.test(value),
  );
  add(
    "robots",
    "Navodila za indeksiranje",
    !noindex,
    noindex
      ? "V meta oznakah je navodilo noindex ali none."
      : "V pregledanih meta oznakah ni navodila noindex.",
    "Noindex je lahko nameren. HTTP glave, robots.txt in dejansko indeksiranje niso preverjeni.",
  );
  add(
    "alt",
    "Besedilne alternative slik",
    missingAlt === 0,
    `Slike: ${images}. Brez atributa alt: ${missingAlt}. Prazen alt: ${emptyAlt}.`,
    "Vsebinske slike potrebujejo smiseln opis; okrasne prazen alt. Primernosti opisov in slik v CSS ne moremo oceniti.",
  );
  add(
    "social",
    "Predogled pri deljenju",
    ["og:title", "og:description", "og:image"].every((key) => social.has(key)),
    "Pregledane so neprazne oznake og:title, og:description in og:image.",
    "Dopolni manjkajoče oznake in preizkusi predogled v ciljnem omrežju. Dosegljivost slike ni preverjena.",
  );
  add(
    "charset",
    "Kodiranje besedila",
    charset,
    charset
      ? "Najdena je meta oznaka charset UTF-8."
      : "Meta oznake charset UTF-8 ni.",
    "Uporabi UTF-8. Kodiranje, poslano v HTTP glavi, v tem pregledu ni vidno.",
  );
  return { checks, bytes, images, headings: levels.length };
}
