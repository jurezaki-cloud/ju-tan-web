"use client";
import { useEffect, useRef, useState } from "react";
import { FileText, ArrowUp, ArrowDown } from "lucide-react";
import {
  PDF_MAX_BYTES,
  PDF_MAX_FILES,
  PDF_MAX_PAGES,
  parsePdfRange,
  type PdfInput,
  type PdfJob,
  type PdfReply,
} from "@/lib/free-lab/pdf";
import styles from "./pdf-master.module.css";

type Item = PdfInput & { id: number; name: string; pages: number };
type Result = { url: string; bytes: number; pages: number };
export default function PdfMaster() {
  const [items, setItems] = useState<Item[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const version = useRef(0);
  const cancel = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      version.current++;
      cancel.current?.();
    },
    [],
  );
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  function invalidate() {
    version.current++;
    cancel.current?.();
    setBusy(false);
    setResult(null);
    setMessage("");
  }
  function run(job: PdfJob): Promise<PdfReply> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./pdf.worker.ts", import.meta.url), {
        type: "module",
      });
      const cleanup = () => {
        clearTimeout(timer);
        worker.terminate();
        if (cancel.current === stop) cancel.current = null;
      };
      const stop = () => {
        cleanup();
        reject(new Error("Obdelava je prekinjena."));
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            "Obdelava traja predolgo. Poskusi z manjšo datoteko ali manj stranmi.",
          ),
        );
      }, 30_000);
      cancel.current = stop;
      worker.onmessage = (event: MessageEvent<PdfReply>) => {
        cleanup();
        if (event.data.error) reject(new Error(event.data.error));
        else resolve(event.data);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        cleanup();
        reject(
          new Error(
            "Obdelave ni mogoče zagnati. Poskusi znova v novejšem brskalniku.",
          ),
        );
      };
      try {
        worker.postMessage(job);
      } catch {
        cleanup();
        reject(
          new Error(
            "Dokumentov ni mogoče obdelati. Poskusi z manjšo datoteko.",
          ),
        );
      }
    });
  }
  async function load(files: File[]) {
    if (!files.length) return;
    invalidate();
    setItems([]);
    const current = version.current;
    setBusy(true);
    setMessage("Preverjam dokumente …");
    try {
      if (files.length > PDF_MAX_FILES)
        throw new Error("Izberi največ 10 datotek.");
      if (files.reduce((sum, file) => sum + file.size, 0) > PDF_MAX_BYTES)
        throw new Error("Skupna velikost dokumentov je omejena na 20 MB.");
      const inputs = await Promise.all(
        files.map(async (file, id) => ({
          id,
          name: file.name,
          bytes: await file.arrayBuffer(),
          range: "",
          rotation: 0,
        })),
      );
      if (current !== version.current) return;
      const response = await run({ type: "inspect", files: inputs });
      if (current !== version.current) return;
      setItems(
        inputs.map((input, index) => ({
          ...input,
          pages: response.pages[index],
        })),
      );
      setMessage(
        "Dokumenti so pripravljeni. Uredi zaporedje, izberi strani in pripravi PDF.",
      );
    } catch (error) {
      if (current === version.current)
        setMessage(
          error instanceof Error
            ? error.message
            : "Dokumentov ni mogoče odpreti.",
        );
    } finally {
      if (current === version.current) setBusy(false);
    }
  }
  const selections = items.map((item) => {
    try {
      return { pages: parsePdfRange(item.range, item.pages), error: "" };
    } catch (error) {
      return {
        pages: [],
        error:
          error instanceof Error ? error.message : "Neveljaven izbor strani.",
      };
    }
  });
  const total = selections.reduce(
    (count, selected) => count + selected.pages.length,
    0,
  );
  const valid =
    !!items.length &&
    total > 0 &&
    total <= PDF_MAX_PAGES &&
    selections.every((selected) => !selected.error);
  function move(index: number, delta: number) {
    invalidate();
    setItems((previous) => {
      const next = [...previous];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  }
  async function build() {
    if (!valid || busy) return;
    invalidate();
    const current = version.current;
    setBusy(true);
    setMessage("Pripravljam nov PDF …");
    try {
      const response = await run({ type: "export", files: items });
      if (current !== version.current) return;
      if (!response.output) throw new Error("Izvoz ni uspel.");
      const blob = new Blob([Uint8Array.from(response.output).buffer], {
        type: "application/pdf",
      });
      setResult({
        url: URL.createObjectURL(blob),
        bytes: blob.size,
        pages: total,
      });
      setMessage(
        "PDF je pripravljen za prenos. Pred uporabo preveri vse strani.",
      );
    } catch (error) {
      if (current === version.current)
        setMessage(error instanceof Error ? error.message : "Izvoz ni uspel.");
    } finally {
      if (current === version.current) setBusy(false);
    }
  }
  return (
    <section className={styles.studio} aria-label="Urejevalnik PDF">
      <div className={styles.panel}>
        <h2>01 · Izberi dokumente.</h2>
        <label className={styles.file} htmlFor="pdf-files">
          Izberi PDF-je
          <input
            id="pdf-files"
            type="file"
            multiple
            accept="application/pdf,.pdf"
            aria-describedby="pdf-limits"
            onChange={(event) => {
              void load(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </label>
        <p className={styles.hint} id="pdf-limits">
          Do 10 datotek, skupaj 20 MB in 200 strani. Nov izbor zamenja celoten
          seznam. Obdelava poteka na tvoji napravi.
        </p>
        <h2>02 · Sestavi svoj PDF.</h2>
        <p className={styles.hint}>
          Prazno polje pomeni vse strani. Primer: 3, 1, 5-7. Obrnjen obseg 5-3
          spremeni zaporedje; ponovljena številka podvoji stran. Za izločitev
          strani izberi en dokument in želene številke.
        </p>
        {!items.length && (
          <p className={styles.empty}>
            <FileText size={36} aria-hidden="true" /> Tu se prikaže seznam
            izbranih dokumentov.
          </p>
        )}
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={item.id}>
              <div className={styles.itemTop}>
                <h3>
                  {index + 1}. {item.name}
                </h3>
                <span>{item.pages} strani</span>
              </div>
              <fieldset disabled={busy} className={styles.fields}>
                <legend className={styles.srOnly}>
                  Nastavitve dokumenta {index + 1}
                </legend>
                <label htmlFor={`pdf-range-${item.id}`}>
                  Strani za izvoz
                  <input
                    id={`pdf-range-${item.id}`}
                    value={item.range}
                    maxLength={1200}
                    placeholder="Vse strani"
                    aria-invalid={!!selections[index].error}
                    aria-describedby={`pdf-error-${item.id}`}
                    onChange={(event) => {
                      invalidate();
                      setItems((previous) =>
                        previous.map((value) =>
                          value.id === item.id
                            ? { ...value, range: event.target.value }
                            : value,
                        ),
                      );
                    }}
                  />
                </label>
                <label htmlFor={`pdf-rotate-${item.id}`}>
                  Zavrti izbrane strani
                  <select
                    id={`pdf-rotate-${item.id}`}
                    value={item.rotation}
                    onChange={(event) => {
                      invalidate();
                      setItems((previous) =>
                        previous.map((value) =>
                          value.id === item.id
                            ? { ...value, rotation: Number(event.target.value) }
                            : value,
                        ),
                      );
                    }}
                  >
                    <option value={0}>Brez dodatnega vrtenja</option>
                    <option value={90}>90° v desno</option>
                    <option value={180}>180°</option>
                    <option value={270}>90° v levo</option>
                  </select>
                </label>
              </fieldset>
              <p
                id={`pdf-error-${item.id}`}
                className={styles.error}
                role="status"
              >
                {selections[index].error}
              </p>
              <div className={styles.itemActions}>
                <button
                  disabled={busy || index === 0}
                  aria-label={`Premakni dokument ${index + 1} navzgor`}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={17} aria-hidden="true" /> Gor
                </button>
                <button
                  disabled={busy || index === items.length - 1}
                  aria-label={`Premakni dokument ${index + 1} navzdol`}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={17} aria-hidden="true" /> Dol
                </button>
                <button
                  disabled={busy}
                  aria-label={`Odstrani dokument ${index + 1}`}
                  onClick={() => {
                    invalidate();
                    setItems((previous) =>
                      previous.filter((value) => value.id !== item.id),
                    );
                  }}
                >
                  Odstrani
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.panel}>
        <h2>03 · Pripravi in prenesi.</h2>
        <p className={styles.total}>
          {total}
          <span> izbranih strani</span>
        </p>
        {total > PDF_MAX_PAGES && (
          <p className={styles.error}>Izberi največ 200 strani za izvoz.</p>
        )}
        <p className={styles.hint}>
          Dokumenti se združijo v prikazanem vrstnem redu. To je pregled izbora
          brez sličic strani.
        </p>
        <button
          className={styles.primary}
          disabled={!valid || busy}
          onClick={() => void build()}
        >
          Pripravi PDF
        </button>
        <p className={styles.status} role="status" aria-live="polite">
          {message || "Izberi dokumente za začetek."}
        </p>
        {result && (
          <>
            <p>
              {result.pages} strani ·{" "}
              {(result.bytes / 1024).toLocaleString("sl-SI", {
                maximumFractionDigits: 1,
              })}{" "}
              KB
            </p>
            <a
              className={styles.primary}
              href={result.url}
              download="ju-tan-pdf-master.pdf"
            >
              Prenesi PDF
            </a>
          </>
        )}
        <button
          className={styles.clear}
          disabled={!items.length && !busy && !message}
          onClick={() => {
            invalidate();
            setItems([]);
          }}
        >
          Prekini in počisti vse
        </button>
        <p className={styles.notice}>
          Obrazci in zaščiteni PDF-ji niso podprti. Izvoz ne ohrani veljavnosti
          digitalnih podpisov, zaznamkov in strukture dostopnosti izvirnika.
          Izvirne datoteke ostanejo nespremenjene.
        </p>
        <p className={styles.hint}>
          Brez nalaganja dokumentov na strežnik. Datoteke se odstranijo iz
          orodja ob čiščenju ali osvežitvi strani. Orodje ni namenjeno
          odstranjevanju zlonamerne vsebine iz PDF.
        </p>
      </div>
    </section>
  );
}
