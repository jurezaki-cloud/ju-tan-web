"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Gift,
  Heart,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  decodeMagic,
  encodeMagic,
  initialMagic,
  type Magic,
} from "@/lib/magic";
import styles from "./magic.module.css";

const kinds = [
  {
    id: "card",
    label: "Voščilnica",
    detail: "Za dneve, ki štejejo",
    icon: Heart,
    title: "Danes je tvoj dan.",
  },
  {
    id: "secret",
    label: "Skrivno sporočilo",
    detail: "Besede samo zate",
    icon: Mail,
    title: "Nekaj ti moram povedati …",
  },
  {
    id: "gift",
    label: "Presenečenje",
    detail: "Majhna gesta, velik nasmeh",
    icon: Gift,
    title: "En majhen čudež zate.",
  },
  {
    id: "invite",
    label: "Osebno vabilo",
    detail: "Skupaj je lepše",
    icon: Sparkles,
    title: "Pridi. Praznujva skupaj!",
  },
] as const;
const themes = [
  { id: "mint", name: "Severni sij" },
  { id: "rose", name: "Rožnate sanje" },
  { id: "gold", name: "Zlata ura" },
] as const;

function Surprise({
  value,
  opened,
  onOpen,
}: {
  value: Magic;
  opened: boolean;
  onOpen: () => void;
}) {
  const Icon = kinds.find((kind) => kind.id === value.kind)!.icon;
  return (
    <div
      className={`${styles.card} ${styles[value.theme]} ${opened ? styles.opened : ""}`}
    >
      <div className={styles.orbit} aria-hidden="true" />
      <span className={styles.cardBrand}>JU-TAN · MAGIC SURPRISE</span>
      {!opened ? (
        <div className={styles.sealed}>
          <span className={styles.eyebrow}>
            ZA {value.to || "NEKOGA POSEBNEGA"}
          </span>
          <button
            type="button"
            className={styles.present}
            onClick={onOpen}
            aria-label="Odpri presenečenje"
          >
            <Icon size={64} strokeWidth={1} />
            <span>
              Odpri presenečenje <Sparkles size={16} />
            </span>
          </button>
          <p>Nekdo ti želi polepšati dan.</p>
        </div>
      ) : (
        <div className={styles.reveal} aria-live="polite">
          <span className={styles.eyebrow}>Hej, {value.to || "ti"}!</span>
          <Icon size={38} strokeWidth={1.4} />
          <h2>{value.title}</h2>
          <p>{value.message}</p>
          {value.kind === "invite" && (
            <div className={styles.event}>
              <strong>
                {value.date ? value.date.replace("T", " · ") : "Datum dogodka"}
              </strong>
              <span>{value.place || "Kraj dogodka"}</span>
              <small>Čas velja v kraju dogodka.</small>
            </div>
          )}
          <span className={styles.signature}>
            Zate, {value.from || "iz srca"} ♡
          </span>
        </div>
      )}
      <span className={styles.cardFoot}>MAJHNA POZORNOST. VELIK OBČUTEK.</span>
    </div>
  );
}

export default function MagicStudio() {
  const [value, setValue] = useState<Magic>(initialMagic);
  const [received, setReceived] = useState<Magic | null>(null);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    // Keep the share payload intact when the site's skip link moves focus.
    const skipLink = document.querySelector<HTMLAnchorElement>("a.skip-link");
    const skip = (event: MouseEvent) => {
      event.preventDefault();
      const main = document.getElementById("main");
      main?.focus();
      main?.scrollIntoView();
    };
    skipLink?.addEventListener("click", skip);
    const load = () => {
      setOpened(false);
      setReceived(null);
      setError("");
      setUrl("");
      setStatus("");
      if (
        window.location.hash &&
        !["#ustvari", "#main"].includes(window.location.hash)
      ) {
        try {
          setReceived(decodeMagic(window.location.hash.slice(1)));
        } catch {
          setError(
            "Te povezave ni mogoče odpreti. Morda je nepopolna. Prosi pošiljatelja za celotno povezavo ali ustvari novo presenečenje.",
          );
        }
      }
    };
    load();
    window.addEventListener("hashchange", load);
    return () => {
      window.removeEventListener("hashchange", load);
      skipLink?.removeEventListener("click", skip);
    };
  }, []);
  function update<K extends keyof Magic>(key: K, next: Magic[K]) {
    setValue((previous) => ({ ...previous, [key]: next }));
    setUrl("");
    setStatus("");
  }
  function create(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      setUrl(`${window.location.origin}/magic#${encodeMagic(value)}`);
    } catch {
      setError(
        "Preveri vnos: dodaj prejemnika, podpis in sporočilo, pri vabilu pa še datum in kraj.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Povezava je kopirana. Pošlji jo nekomu posebnemu.");
    } catch {
      setStatus(
        "Kopiranje ni na voljo. Označi in kopiraj povezavo v spodnjem polju.",
      );
    }
  }
  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ title: "Presenečenje zate · JU-TAN", url });
      setStatus("Povezava je predana izbrani aplikaciji.");
    } catch (err) {
      if (!(err instanceof Error && err.name === "AbortError"))
        setStatus("Deljenje ni uspelo. Uporabi kopiranje povezave.");
    }
  }
  return (
    <div className={styles.studio}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          JU-TAN<span>STUDIO</span>
        </Link>
        <span className={styles.headerLabel}>Malo čarovnije. Veliko srca.</span>
        <a href={received ? "/magic" : "#ustvari"} className={styles.headerCta}>
          {received ? "Ustvari svoje" : "Začni ustvarjati"}{" "}
          <ArrowUpRight size={16} />
        </a>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        {received ? (
          <section className={styles.recipient}>
            <p className={styles.eyebrow}>NEKAJ LEPEGA TE ČAKA</p>
            <h1>Tole je samo zate.</h1>
            <Surprise
              value={received}
              opened={opened}
              onOpen={() => setOpened(true)}
            />
            {opened && (
              <button
                className={styles.textButton}
                onClick={() => setOpened(false)}
              >
                Doživi še enkrat ↺
              </button>
            )}
            <p>
              Polepšaj dan še ti.{" "}
              <a href="/magic">Ustvari brezplačno presenečenje →</a>
            </p>
          </section>
        ) : (
          <>
            <section className={styles.intro}>
              <p className={styles.eyebrow}>
                <span /> BREZPLAČNO. BREZ PRIJAVE. IZ SRCA.
              </p>
              <h1>
                Majhen klik.
                <br />
                <span>Velik nasmeh.</span>
              </h1>
              <p>
                Besede spremeni v doživetje. Ustvari nekaj osebnega
                <br className={styles.desktopBreak} /> in pošlji malo čarovnije
                in z malo čarovnije polepšaj nekomu povsem običajen dan.
              </p>
              <div className={styles.benefits}>
                <span>
                  <Check size={14} /> Pripravljeno v minuti
                </span>
                <span>
                  <Check size={14} /> Ena povezava, veliko veselja
                </span>
              </div>
            </section>
            <section
              id="ustvari"
              className={styles.workspace}
              aria-label="Ustvarjalnik presenečenj"
            >
              <form onSubmit={create} className={styles.editor}>
                <div className={styles.step}>
                  <span>01</span>
                  <h2>Izberi svoj trenutek</h2>
                </div>
                <div className={styles.kinds}>
                  {kinds.map((kind) => (
                    <button
                      key={kind.id}
                      type="button"
                      aria-pressed={value.kind === kind.id}
                      className={value.kind === kind.id ? styles.selected : ""}
                      onClick={() => {
                        update("kind", kind.id);
                        update("title", kind.title);
                        setOpened(false);
                      }}
                    >
                      <kind.icon size={21} />
                      <strong>{kind.label}</strong>
                      <small>{kind.detail}</small>
                    </button>
                  ))}
                </div>
                <div className={styles.step}>
                  <span>02</span>
                  <h2>Dodaj osebno noto</h2>
                </div>
                <div className={styles.fields}>
                  <label>
                    Za koga?
                    <input
                      required
                      maxLength={50}
                      placeholder="npr. Tanja"
                      value={value.to}
                      onChange={(event) => update("to", event.target.value)}
                    />
                  </label>
                  <label>
                    Od koga?
                    <input
                      required
                      maxLength={50}
                      placeholder="Tvoje ime"
                      value={value.from}
                      onChange={(event) => update("from", event.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Naslov
                  <input
                    required
                    maxLength={80}
                    value={value.title}
                    onChange={(event) => update("title", event.target.value)}
                  />
                </label>
                <label>
                  Tvoje sporočilo
                  <textarea
                    required
                    maxLength={600}
                    rows={4}
                    value={value.message}
                    onChange={(event) => update("message", event.target.value)}
                  />
                  <small className={styles.counter}>
                    {value.message.length} / 600
                  </small>
                </label>
                {value.kind === "invite" && (
                  <div className={styles.fields}>
                    <label>
                      Datum in čas
                      <input
                        type="datetime-local"
                        required
                        value={value.date}
                        onChange={(event) => update("date", event.target.value)}
                      />
                    </label>
                    <label>
                      Kraj dogodka
                      <input
                        required
                        maxLength={100}
                        placeholder="npr. Kavarna ob reki"
                        value={value.place}
                        onChange={(event) =>
                          update("place", event.target.value)
                        }
                      />
                    </label>
                  </div>
                )}
                <fieldset className={styles.themes}>
                  <legend>Barva tvojega presenečenja</legend>
                  {themes.map((theme) => (
                    <button
                      type="button"
                      key={theme.id}
                      aria-pressed={value.theme === theme.id}
                      onClick={() => update("theme", theme.id)}
                      className={`${styles[theme.id]} ${value.theme === theme.id ? styles.activeTheme : ""}`}
                    >
                      <span />
                      {theme.name}
                    </button>
                  ))}
                </fieldset>
                <button className={styles.primary} type="submit">
                  <Sparkles size={18} /> Ustvari povezavo za deljenje{" "}
                  <ArrowUpRight size={18} />
                </button>
                <p className={styles.note}>
                  Vsebina je shranjena v povezavi, ne v naši podatkovni bazi.
                  Vsakdo s povezavo jo lahko prebere. Ni šifrirana; ne vnašaj
                  občutljivih podatkov. Povezave ni mogoče preklicati.
                </p>
                {url && (
                  <div className={styles.sharePanel}>
                    <h3>Tvoja čarovnija je pripravljena ✨</h3>
                    <label>
                      Povezava za prejemnika
                      <input
                        readOnly
                        value={url}
                        onFocus={(event) => event.target.select()}
                      />
                    </label>
                    <div className={styles.shareActions}>
                      <button type="button" onClick={copy}>
                        <Copy size={16} /> Kopiraj
                      </button>
                      <button type="button" onClick={share}>
                        Deli povezavo <ArrowUpRight size={16} />
                      </button>
                      <a href={url} target="_blank" rel="noreferrer">
                        Preizkusi ↗
                      </a>
                    </div>
                  </div>
                )}
                <p role="status" className={styles.status}>
                  {status}
                </p>
              </form>
              <aside className={styles.preview}>
                <div className={styles.previewLabel}>
                  <span>TAKO BO VIDETI TVOJE PRESENEČENJE</span>
                  <span className={styles.live}>V ŽIVO</span>
                </div>
                <Surprise
                  value={value}
                  opened={opened}
                  onOpen={() => setOpened(true)}
                />
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => setOpened(!opened)}
                >
                  {opened ? "↺ Ponovi odpiranje" : "Preizkusi čarovnijo ↗"}
                </button>
                <p className={styles.previewNote}>
                  Ustvarjeno z mislijo na nekoga posebnega.
                  <br />
                  Lepo na telefonu. Čarobno povsod.
                </p>
              </aside>
            </section>
            <section className={styles.how}>
              <div>
                <span>01 / USTVARI</span>
                <h3>Tvoje besede.</h3>
                <p>Izberi obliko, napiši sporočilo in dodaj svoj podpis.</p>
              </div>
              <div>
                <span>02 / DELI</span>
                <h3>Ena povezava.</h3>
                <p>
                  Pošlji jo v klepetu, po e-pošti ali v svoji najljubši
                  aplikaciji.
                </p>
              </div>
              <div>
                <span>03 / RAZVESELI</span>
                <h3>Njihov nasmeh.</h3>
                <p>
                  Prejemnik odpre osebno presenečenje. Brez prijave in
                  namestitve.
                </p>
              </div>
            </section>
          </>
        )}
        {error && (
          <div role="alert" className={styles.error}>
            {error} <a href="/magic">Začni znova →</a>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <span>
          JU-TAN MAGIC SURPRISE <small>Ustvarjamo digitalne trenutke.</small>
        </span>
        <p>
          Osnovno štetje obiskov po privolitvi, brez vsebine sporočil.{" "}
          <Link href="/politika-zasebnosti">Zasebnost</Link>
        </p>
        <Link href="/">
          Spoznaj JU-TAN <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}

