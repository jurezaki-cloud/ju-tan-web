"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, SearchCheck } from "lucide-react";
import {
  DOCTOR_EXAMPLE,
  HTML_MAX_BYTES,
  doctorReportText,
  type DoctorReply,
  type DoctorReport,
} from "@/lib/free-lab/doctor";
import styles from "./website-doctor.module.css";

export default function WebsiteDoctor() {
  const [html, setHtml] = useState("");
  const [report, setReport] = useState<DoctorReport | null>(null);
  const [download, setDownload] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const task = useRef<{
    worker: Worker;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const revision = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(
    () => () => {
      revision.current++;
      if (task.current) {
        task.current.worker.terminate();
        clearTimeout(task.current.timer);
      }
    },
    [],
  );
  useEffect(
    () => () => {
      if (download) URL.revokeObjectURL(download);
    },
    [download],
  );
  useEffect(() => {
    if (report) heading.current?.focus();
  }, [report]);

  function stop() {
    revision.current++;
    if (task.current) {
      task.current.worker.terminate();
      clearTimeout(task.current.timer);
      task.current = null;
    }
    setBusy(false);
  }
  function edit(value: string) {
    stop();
    setHtml(value);
    setReport(null);
    setDownload("");
    setMessage("");
  }
  function inspect() {
    stop();
    setReport(null);
    setDownload("");
    if (!html.trim()) {
      setMessage("Najprej prilepi HTML ali izberi vzorčni primer.");
      return;
    }
    if (html.length > HTML_MAX_BYTES) {
      setMessage("HTML je omejen na 500 KiB.");
      return;
    }
    const current = revision.current;
    setBusy(true);
    setMessage("Pregledujem HTML na tvoji napravi …");
    try {
      const worker = new Worker(
        new URL("./doctor.worker.ts", import.meta.url),
        { type: "module" },
      );
      const finish = () => {
        worker.terminate();
        clearTimeout(timer);
        task.current = null;
        setBusy(false);
      };
      const timer = setTimeout(() => {
        if (revision.current !== current) return;
        finish();
        setMessage("Pregled traja predolgo. Poskusi z manjšim dokumentom.");
      }, 8000);
      task.current = { worker, timer };
      worker.onmessage = (event: MessageEvent<DoctorReply>) => {
        if (revision.current !== current) return;
        finish();
        if (event.data.error !== undefined) {
          setMessage(event.data.error);
          return;
        }
        const next = event.data.report;
        setReport(next);
        setDownload(
          URL.createObjectURL(
            new Blob([doctorReportText(next)], {
              type: "text/plain;charset=utf-8",
            }),
          ),
        );
        setMessage("Pregled je končan. Spodaj so ugotovitve in priporočila.");
      };
      worker.onerror = (event) => {
        event.preventDefault();
        if (revision.current !== current) return;
        finish();
        setMessage(
          "Pregleda ni mogoče zagnati. Poskusi znova v novejšem brskalniku.",
        );
      };
      worker.postMessage(html);
    } catch {
      stop();
      setMessage(
        "Pregleda ni mogoče zagnati. Poskusi znova v novejšem brskalniku.",
      );
    }
  }
  const review =
    report?.checks.filter((check) => check.status === "review").length ?? 0;
  return (
    <>
      <section className={styles.editor} aria-label="Pregled HTML-ja">
        <div className={styles.panel}>
          <p className={styles.kicker}>01 / TVOJA STRAN POD DROBNOGLEDOM</p>
          <h2>Prilepi. Preveri. Izboljšaj.</h2>
          <label htmlFor="doctor-html">Celotna izvorna koda HTML</label>
          <textarea
            id="doctor-html"
            value={html}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-describedby="doctor-help"
            placeholder="<!doctype html> …"
            onChange={(event) => edit(event.target.value)}
          />
          <p id="doctor-help" className={styles.hint}>
            Na računalniku odpri izvorno kodo svoje strani in kopiraj celoten
            dokument z oznakami html, head in body. Največ 500 KiB. Sam spletni
            naslov ni dovolj.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              disabled={busy || !html.trim() || html.length > HTML_MAX_BYTES}
              onClick={inspect}
            >
              <SearchCheck size={18} aria-hidden="true" /> Preglej HTML
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => edit(DOCTOR_EXAMPLE)}
            >
              Vstavi primer
            </button>
            <button
              type="button"
              className={styles.secondary}
              disabled={!html && !busy && !report}
              onClick={() => edit("")}
            >
              Prekini in počisti
            </button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">
            {message ||
              (html.length > HTML_MAX_BYTES
                ? "HTML je omejen na 500 KiB."
                : "Koda ostane v tvojem brskalniku. Sprememba vnosa odstrani staro poročilo.")}
          </p>
        </div>
        <aside className={styles.panel} aria-labelledby="doctor-scope">
          <p className={styles.kicker}>JASNO, KAJ IZVEŠ</p>
          <h2 id="doctor-scope">11 pregledov. Konkretni koraki.</h2>
          <ul className={styles.scope}>
            <li>Naslov, opis in canonical</li>
            <li>Jezik, H1 in ravni naslovov</li>
            <li>Mobilne nastavitve in alternative slik</li>
            <li>Meta navodila za iskalnike in deljenje</li>
          </ul>
          <p className={styles.hint}>
            To je osnovni pregled prilepljene kode. Ne odpira žive strani in ne
            potrjuje hitrosti, varnosti, indeksiranja ali skladnosti z WCAG.
          </p>
          <a
            className={styles.external}
            href="https://pagespeed.web.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Izmeri hitrost v PageSpeed Insights{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className={styles.srOnly}> (Google, nov zavihek)</span>
          </a>
          <p className={styles.hint}>
            Odpre se Googlovo orodje, kamor sam vneseš javni naslov. Tvojega
            HTML-ja ne posredujemo.
          </p>
        </aside>
      </section>
      {report && (
        <section
          className={styles.results}
          aria-labelledby="doctor-result-title"
        >
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.kicker}>02 / TVOJ NASLEDNJI KORAK</p>
              <h2 id="doctor-result-title" ref={heading} tabIndex={-1}>
                Poročilo o HTML-ju
              </h2>
              <p>
                {report.checks.length - review} preverjanj brez opozorila ·{" "}
                {review} za pregled
              </p>
            </div>
            <a
              className={styles.secondary}
              href={download}
              download="ju-tan-website-doctor.txt"
            >
              Prenesi poročilo TXT
            </a>
          </div>
          <p className={styles.hint}>
            »Najdeno« pomeni, da je osnovni pogoj v kodi izpolnjen. Ni ocena
            kakovosti celotne strani. Ugotovitve »Preveri« so prikazane najprej.
          </p>
          <ol className={styles.checks}>
            {[...report.checks]
              .sort(
                (a, b) =>
                  Number(a.status === "pass") - Number(b.status === "pass"),
              )
              .map((check) => (
                <li key={check.id}>
                  <span className={styles.badge} data-status={check.status}>
                    {check.status === "pass" ? (
                      <CheckCircle2 size={16} aria-hidden="true" />
                    ) : (
                      <SearchCheck size={16} aria-hidden="true" />
                    )}
                    {check.status === "pass" ? "Najdeno" : "Preveri"}
                  </span>
                  <h3>{check.title}</h3>
                  <p>{check.detail}</p>
                  <p className={styles.advice}>{check.action}</p>
                </li>
              ))}
          </ol>
          <p className={styles.notice}>
            Preveri še uporabo s tipkovnico, bralnikom zaslona, kontrast in
            dejanski prikaz na telefonu. Vsebina, ki jo doda JavaScript, HTTP
            glave, robots.txt in dosegljivost povezav v tem poročilu niso
            zajeti.
          </p>
        </section>
      )}
    </>
  );
}
