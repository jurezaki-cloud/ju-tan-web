export const categories = [
  "Vse",
  "Dokumenti",
  "Slike in dizajn",
  "Zabava",
  "Splet",
] as const;
export type Category = (typeof categories)[number];
export type LabTool = {
  slug: string;
  name: string;
  category: Exclude<Category, "Vse">;
  description: string;
  features: readonly string[];
  icon: "pdf" | "qr" | "image" | "gift" | "quiz" | "web";
  release:
    | { status: "planned" }
    | { status: "available"; href: string; label: string };
};

export const labTools: readonly LabTool[] = [
  {
    slug: "pdf-master",
    name: "PDF Master",
    category: "Dokumenti",
    icon: "pdf",
    description: "Manj zapletov z dokumenti. Več časa za pomembne stvari.",
    features: [
      "Združevanje in razdeljevanje PDF",
      "Vrtenje in razvrščanje strani",
      "Obdelava na tvoji napravi",
    ],
    release: {
      status: "available",
      href: "/free/pdf-master",
      label: "Uredi PDF",
    },
  },
  {
    slug: "qr-studio",
    name: "QR Studio",
    category: "Splet",
    icon: "qr",
    description: "Od povezave do QR kode, ki se ujema s tvojim slogom.",
    features: [
      "Kode za povezave, Wi-Fi in kontakte",
      "Prilagajanje barv",
      "Izvoz PNG in SVG",
    ],
    release: {
      status: "available",
      href: "/free/qr-studio",
      label: "Ustvari QR kodo",
    },
  },
  {
    slug: "image-magic",
    name: "Image Magic",
    category: "Slike in dizajn",
    icon: "image",
    description: "Lažje fotografije. Prave dimenzije. Pripravljeno za splet.",
    features: [
      "Sprememba velikosti fotografij",
      "Pretvorba JPG, PNG in WebP",
      "Lokalna obdelava brez nalaganja",
    ],
    release: {
      status: "available",
      href: "/free/image-magic",
      label: "Uredi sliko",
    },
  },
  {
    slug: "voscilnice",
    name: "WOW Voščilnice",
    category: "Slike in dizajn",
    icon: "gift",
    description: "Majhna pozornost. Velik nasmeh. Ustvari osebno presenečenje.",
    features: [
      "Animirane voščilnice v Magic Surprise",
      "Osebna sporočila in vabila",
      "Deljenje s povezavo brez prijave",
    ],
    release: {
      status: "available",
      href: "/magic",
      label: "Odpri Magic Surprise",
    },
  },
  {
    slug: "kviz-slovenija",
    name: "Slovenija Quiz Battle",
    category: "Zabava",
    icon: "quiz",
    description: "Kako dobro poznaš Slovenijo? Deset vprašanj. Tvoj izziv.",
    features: [
      "Vprašanja o Sloveniji",
      "Solo kviz z razlagami odgovorov",
      "Rezultat brez prijave",
    ],
    release: {
      status: "available",
      href: "/free/kviz-slovenija",
      label: "Začni kviz",
    },
  },
  {
    slug: "website-doctor",
    name: "Website Doctor",
    category: "Splet",
    icon: "web",
    description:
      "Poglej svojo spletno stran skozi oči hitrosti in uporabnosti.",
    features: [
      "Pregled hitrosti, SEO in dostopnosti",
      "Razumljiva priporočila",
      "Načrtovana analiza javnih spletnih strani",
    ],
    release: { status: "planned" },
  },
];

export function getLabTool(slug: string) {
  return labTools.find((tool) => tool.slug === slug);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sl")
    .trim();
}

export function filterLabTools(query: string, category: Category) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return labTools.filter((tool) => {
    const text = normalize(
      [tool.name, tool.description, tool.category, ...tool.features].join(" "),
    );
    return (
      (category === "Vse" || tool.category === category) &&
      words.every((word) => text.includes(word))
    );
  });
}
