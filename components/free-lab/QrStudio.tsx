"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  Download,
  LockKeyhole,
  QrCode,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  buildQrPayload,
  initialFields,
  qrKinds,
  type QrField,
  type QrFields,
  type QrKind,
} from "@/lib/free-lab/qr/payload";
import {
  exportSizes,
  palettes,
  qrPath,
  qrRaster,
  qrSvg,
  QUIET_ZONE,
  type ExportSize,
  type QrMatrix,
} from "@/lib/free-lab/qr/render";
import styles from "./qr-studio.module.css";

type FieldDefinition = {
  key: QrField;
  label: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  multiline?: boolean;
  optional?: boolean;
};
const email: FieldDefinition = {
  key: "email",
  label: "E-poštni naslov",
  placeholder: "ime@primer.si",
  type: "email",
  maxLength: 254,
};
const phone: FieldDefinition = {
  key: "phone",
  label: "Telefonska številka",
  placeholder: "+386 40 123 456",
  type: "tel",
  maxLength: 30,
};
const message: FieldDefinition = {
  key: "message",
  label: "Sporočilo",
  placeholder: "Tvoje sporočilo …",
  multiline: true,
  optional: true,
  maxLength: 500,
};
const fieldsByKind: Record<QrKind, FieldDefinition[]> = {
  url: [
    {
      key: "url",
      label: "Spletni naslov",
      placeholder: "https://tvoja-stran.si",
      maxLength: 1000,
    },
  ],
  wifi: [
    {
      key: "ssid",
      label: "Ime omrežja (SSID)",
      placeholder: "Ime tvojega omrežja",
      maxLength: 32,
    },
    {
      key: "password",
      label: "Geslo omrežja",
      type: "password",
      maxLength: 64,
    },
  ],
  email: [
    email,
    { key: "subject", label: "Zadeva", optional: true, maxLength: 120 },
    message,
  ],
  phone: [phone],
  sms: [phone, message],
  contact: [
    { key: "firstName", label: "Ime", placeholder: "Ana", maxLength: 80 },
    { key: "lastName", label: "Priimek", placeholder: "Novak", maxLength: 80 },
    { key: "organization", label: "Podjetje", optional: true, maxLength: 120 },
    { ...email, optional: true },
    { ...phone, optional: true },
    {
      key: "website",
      label: "Spletna stran",
      placeholder: "https://primer.si",
      optional: true,
      maxLength: 300,
    },
  ],
};

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari may still be consuming the URL when click returns.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export default function QrStudio() {
  const [kind, setKind] = useState<QrKind>("url");
  const [fields, setFields] = useState<QrFields>({ ...initialFields });
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [pixels, setPixels] = useState<ExportSize>(1024);
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<{
    data: string;
    matrix: QrMatrix;
  } | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const payload = buildQrPayload(kind, fields);
  const data = payload.ok ? payload.data : null;
  const matrix = result?.data === data ? result.matrix : null;
  const color = palettes[paletteIndex].color;
  const definition = qrKinds.find((item) => item.id === kind)!;

  useEffect(() => {
    if (!data) return;
    let active = true;
    const timer = window.setTimeout(() => {
      void import("qrcode")
        .then(({ default: QRCode }) => {
          if (!active) return;
          const code = QRCode.create(data, { errorCorrectionLevel: "Q" });
          setResult({
            data,
            matrix: { size: code.modules.size, data: code.modules.data },
          });
          setGenerationError(null);
        })
        .catch(() => {
          if (active) setGenerationError(data);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [data, retry]);

  function updateField(key: QrField, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
    setDownloadStatus("");
  }

  async function download(format: "png" | "svg") {
    if (!matrix || saving || !data) return;
    setSaving(true);
    setDownloadStatus("");
    try {
      let blob: Blob;
      if (format === "svg") {
        blob = new Blob([qrSvg(matrix, color, pixels)], {
          type: "image/svg+xml;charset=utf-8",
        });
      } else {
        const canvas = document.createElement("canvas");
        canvas.width = pixels;
        canvas.height = pixels;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.putImageData(
          new ImageData(qrRaster(matrix, color, pixels), pixels, pixels),
          0,
          0,
        );
        blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (value) =>
              value ? resolve(value) : reject(new Error("PNG unavailable")),
            "image/png",
          ),
        );
      }
      saveBlob(blob, `ju-tan-qr-${kind}.${format}`);
      setDownloadStatus(
        `${format.toUpperCase()} je pripravljen za prenos. Na telefonu lahko izbereš shranjevanje v Datoteke.`,
      );
    } catch {
      setDownloadStatus(
        "Prenos ni uspel. Poskusi znova ali izberi drugi format.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.studio} aria-label="Ustvarjalnik QR kod">
      <div className={styles.editor}>
        <div className={styles.step}>
          <span>01</span>
          <h2>Kaj želiš deliti?</h2>
        </div>
        <div className={styles.kinds} role="group" aria-label="Vrsta QR kode">
          {qrKinds.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={kind === item.id}
              onClick={() => {
                setKind(item.id);
                setShowPassword(false);
                setDownloadStatus("");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{definition.hint}</p>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(event) => event.preventDefault()}
        >
          {kind === "wifi" && (
            <label className={styles.field} htmlFor="qr-security">
              Zaščita omrežja
              <select
                id="qr-security"
                value={fields.security}
                onChange={(event) =>
                  updateField("security", event.target.value)
                }
              >
                <option value="WPA">WPA / WPA2 Personal</option>
                <option value="nopass">Odprto omrežje (brez gesla)</option>
              </select>
            </label>
          )}
          <div
            className={
              kind === "contact" ? styles.contactFields : styles.fields
            }
          >
            {fieldsByKind[kind]
              .filter(
                (field) =>
                  !(field.key === "password" && fields.security === "nopass"),
              )
              .map((field) => {
                const invalid = !payload.ok && payload.field === field.key;
                const inputProps = {
                  id: `qr-${field.key}`,
                  value: fields[field.key],
                  maxLength: field.maxLength,
                  placeholder: field.placeholder,
                  onChange: (
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => updateField(field.key, event.target.value),
                  "aria-invalid": invalid,
                  "aria-describedby": invalid ? "qr-validation" : undefined,
                  autoComplete: "off",
                  spellCheck: false,
                };
                return (
                  <div className={styles.field} key={`${kind}-${field.key}`}>
                    <label htmlFor={`qr-${field.key}`}>
                      {field.label}
                      {field.optional && <span> · neobvezno</span>}
                    </label>
                    <div
                      className={
                        field.type === "password" ? styles.password : undefined
                      }
                    >
                      {field.multiline ? (
                        <textarea {...inputProps} rows={3} />
                      ) : (
                        <input
                          {...inputProps}
                          type={
                            field.type === "password" && showPassword
                              ? "text"
                              : (field.type ?? "text")
                          }
                          inputMode={
                            field.key === "url" || field.key === "website"
                              ? "url"
                              : undefined
                          }
                        />
                      )}
                      {field.type === "password" && (
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Skrij geslo" : "Pokaži geslo"
                          }
                          aria-pressed={showPassword}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} aria-hidden="true" />
                          ) : (
                            <Eye size={18} aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {kind === "contact" && (
            <p className={styles.hint}>
              Vnesi vsaj ime ali priimek. Drugi podatki so neobvezni.
            </p>
          )}
          {kind === "wifi" && (
            <>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={fields.hidden === "true"}
                  onChange={(event) =>
                    updateField("hidden", String(event.target.checked))
                  }
                />{" "}
                Skrito omrežje
              </label>
              <p className={styles.notice}>
                QR koda vsebuje podatke omrežja. Vsak, ki jo skenira, lahko
                prebere tudi vključeno geslo.
              </p>
            </>
          )}
          <p
            id="qr-validation"
            className={styles.validation}
            role="status"
            aria-live="polite"
          >
            {!payload.ok ? payload.error : ""}
          </p>
        </form>
        <div className={styles.step}>
          <span>02</span>
          <h2>Dodaj svoj odtenek.</h2>
        </div>
        <div
          className={styles.palettes}
          role="group"
          aria-label="Barva QR kode"
        >
          {palettes.map((palette, index) => (
            <button
              key={palette.name}
              type="button"
              aria-label={palette.name}
              aria-pressed={paletteIndex === index}
              onClick={() => {
                setPaletteIndex(index);
                setDownloadStatus("");
              }}
            >
              <span style={{ "--qr-color": palette.color } as CSSProperties}>
                {paletteIndex === index && (
                  <Check size={17} aria-hidden="true" />
                )}
              </span>
              {palette.name}
            </button>
          ))}
        </div>
        <p className={styles.hint}>
          Temne barve na beli podlagi ohranijo dober kontrast.
        </p>
        <button
          className={styles.reset}
          type="button"
          onClick={() => {
            setFields({ ...initialFields, url: "" });
            setKind("url");
            setPaletteIndex(0);
            setPixels(1024);
            setResult(null);
            setShowPassword(false);
            setDownloadStatus("");
          }}
        >
          <RotateCcw size={15} aria-hidden="true" /> Počisti vse podatke
        </button>
      </div>
      <div className={styles.previewPanel}>
        <div className={styles.previewHeading}>
          <span>ŽIVI PREDOGLED</span>
          <span>QR / STUDIO</span>
        </div>
        <div
          className={styles.qrPaper}
          aria-busy={!!data && !matrix && generationError !== data}
        >
          {matrix ? (
            <svg
              role="img"
              aria-label={`QR koda: ${definition.label}`}
              viewBox={`0 0 ${matrix.size + QUIET_ZONE * 2} ${matrix.size + QUIET_ZONE * 2}`}
              shapeRendering="crispEdges"
            >
              <rect width="100%" height="100%" fill="#ffffff" />
              <path d={qrPath(matrix)} fill={color} />
            </svg>
          ) : (
            <div className={styles.placeholder}>
              <QrCode size={64} strokeWidth={1} aria-hidden="true" />
              <p>
                {!data
                  ? "Vnesi podatke za predogled."
                  : generationError === data
                    ? "Kode ni bilo mogoče ustvariti."
                    : "Ustvarjam kodo …"}
              </p>
              {data && generationError === data && (
                <button
                  type="button"
                  onClick={() => {
                    setGenerationError(null);
                    setRetry((value) => value + 1);
                  }}
                >
                  Poskusi znova
                </button>
              )}
            </div>
          )}
        </div>
        <p className={styles.ready} role="status" aria-live="polite">
          {matrix
            ? "Koda je pripravljena. Preizkusi jo s kamero."
            : "Predogled se posodobi po vnosu."}
        </p>
        <label className={styles.field} htmlFor="qr-size">
          Velikost izvoza
          <select
            id="qr-size"
            value={pixels}
            onChange={(event) => {
              setPixels(Number(event.target.value) as ExportSize);
              setDownloadStatus("");
            }}
          >
            {exportSizes.map((size) => (
              <option value={size} key={size}>
                {size} × {size} px
              </option>
            ))}
          </select>
        </label>
        <div className={styles.downloads}>
          <button
            type="button"
            className={styles.primary}
            disabled={!matrix || saving}
            onClick={() => void download("png")}
          >
            <Download size={18} aria-hidden="true" /> Prenesi PNG
          </button>
          <button
            type="button"
            className={styles.secondary}
            disabled={!matrix || saving}
            onClick={() => void download("svg")}
          >
            Prenesi SVG
          </button>
        </div>
        <p className={styles.downloadStatus} role="status" aria-live="polite">
          {saving ? "Pripravljam prenos …" : downloadStatus}
        </p>
        <div className={styles.privacy}>
          <LockKeyhole size={18} aria-hidden="true" />
          <p>
            <strong>Tvoji podatki ostanejo v brskalniku.</strong>
            <br />
            Brez računa. Brez shranjevanja vnosov. Brez sledenja na tej strani.
          </p>
        </div>
      </div>
    </section>
  );
}
