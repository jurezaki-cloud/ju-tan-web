"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, LockKeyhole } from "lucide-react";
import {
  checkDimensions,
  fitImage,
  formats,
  imageEdges,
  imageFilename,
  inspectImage,
  MAX_IMAGE_BYTES,
  type ImageFormat,
} from "@/lib/free-lab/image";
import styles from "./image-magic.module.css";

type Source = { bitmap: ImageBitmap; name: string; bytes: number };
type Result = {
  url: string;
  bytes: number;
  width: number;
  height: number;
  name: string;
};
const sizeLabel = (bytes: number) =>
  `${(bytes / 1024).toLocaleString("sl-SI", { maximumFractionDigits: 1 })} KB`;

export default function ImageMagic() {
  const [source, setSource] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [format, setFormat] = useState<ImageFormat>("webp");
  const [edge, setEdge] = useState(1920);
  const [quality, setQuality] = useState(82);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const version = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => source?.bitmap.close(), [source]);
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result],
  );
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );

  function invalidate() {
    version.current++;
    setResult(null);
    setMessage("");
    setBusy(false);
  }

  async function load(file: File | undefined) {
    if (!file) return;
    invalidate();
    setSource(null);
    const current = version.current;
    setBusy(true);
    setMessage("Odpiram sliko …");
    try {
      if (file.size > MAX_IMAGE_BYTES)
        throw new Error("Izberi sliko do 20 MB.");
      const buffer = await file.arrayBuffer();
      if (current !== version.current) return;
      const info = inspectImage(buffer);
      const bitmap = await createImageBitmap(
        new Blob([buffer], { type: formats[info.format] }),
        { imageOrientation: "from-image" },
      );
      if (current !== version.current) {
        bitmap.close();
        return;
      }
      try {
        checkDimensions(bitmap.width, bitmap.height);
      } catch (error) {
        bitmap.close();
        throw error;
      }
      setSource({ bitmap, name: file.name, bytes: file.size });
      setMessage("Slika je pripravljena. Izberi nastavitve in pripravi izvoz.");
    } catch (error) {
      if (current === version.current)
        setMessage(
          error instanceof Error && !(error instanceof DOMException)
            ? error.message
            : "Slike ni mogoče odpreti. Preveri datoteko ali poskusi z novejšim brskalnikom.",
        );
    } finally {
      if (current === version.current) setBusy(false);
    }
  }

  async function convert() {
    if (!source || busy) return;
    const current = ++version.current;
    setResult(null);
    setBusy(true);
    setMessage("Pripravljam sliko …");
    const canvas = document.createElement("canvas");
    try {
      const dimensions = fitImage(
        source.bitmap.width,
        source.bitmap.height,
        edge,
      );
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Brskalnik ne podpira obdelave slik.");
      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(source.bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (value) =>
            value
              ? resolve(value)
              : reject(new Error("Izvoz ni uspel. Poskusi manjšo velikost.")),
          formats[format],
          quality / 100,
        ),
      );
      if (current !== version.current) return;
      if (blob.type !== formats[format])
        throw new Error(
          "Brskalnik ne podpira izbranega izvoza. Izberi PNG ali JPG.",
        );
      setResult({
        url: URL.createObjectURL(blob),
        bytes: blob.size,
        ...dimensions,
        name: imageFilename(source.name, format),
      });
      setMessage("Slika je pripravljena za prenos.");
    } catch (error) {
      if (current === version.current)
        setMessage(
          error instanceof Error
            ? error.message
            : "Izvoz ni uspel. Poskusi manjšo sliko.",
        );
    } finally {
      canvas.width = 0;
      canvas.height = 0;
      if (current === version.current) setBusy(false);
    }
  }

  const dimensions = source
    ? fitImage(source.bitmap.width, source.bitmap.height, edge)
    : null;
  return (
    <section className={styles.studio} aria-label="Urejevalnik slik">
      <div className={styles.panel}>
        <h2>01 · Izberi sliko.</h2>
        <label className={styles.file} htmlFor="image-file">
          JPG, PNG ali WebP
          <input
            ref={input}
            id="image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="image-limits"
            onChange={(event) => {
              void load(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        <p id="image-limits" className={styles.hint}>
          Ena statična slika do 20 MB in 24 milijonov slikovnih pik. Datoteka
          ostane na tvoji napravi.
        </p>
        {source && (
          <p className={styles.details}>
            {source.name}
            <br />
            {source.bitmap.width} × {source.bitmap.height} px ·{" "}
            {sizeLabel(source.bytes)}
          </p>
        )}
        <h2>02 · Prilagodi izvoz.</h2>
        <fieldset disabled={busy} className={styles.settings}>
          <legend className={styles.srOnly}>Nastavitve izvoza</legend>
          <label htmlFor="image-format">
            Format
            <select
              id="image-format"
              value={format}
              onChange={(event) => {
                invalidate();
                setFormat(event.target.value as ImageFormat);
              }}
            >
              <option value="webp">WebP · za splet</option>
              <option value="jpeg">JPG · fotografije</option>
              <option value="png">PNG · prosojnost</option>
            </select>
          </label>
          <label htmlFor="image-edge">
            Najdaljša stranica
            <select
              id="image-edge"
              value={edge}
              onChange={(event) => {
                invalidate();
                setEdge(Number(event.target.value));
              }}
            >
              {imageEdges.map((value) => (
                <option value={value} key={value}>
                  {value} px
                </option>
              ))}
            </select>
          </label>
          {format !== "png" && (
            <label htmlFor="image-quality">
              Kakovost: {quality} %
              <input
                id="image-quality"
                type="range"
                min="40"
                max="100"
                step="1"
                value={quality}
                onChange={(event) => {
                  invalidate();
                  setQuality(Number(event.target.value));
                }}
              />
            </label>
          )}
        </fieldset>
        <p className={styles.hint}>
          {dimensions
            ? `Izvoz: ${dimensions.width} × ${dimensions.height} px. `
            : ""}
          Razmerje stranic ohranimo. Manjših slik ne povečujemo.{" "}
          {format === "jpeg"
            ? "Prosojne dele pri JPG zapolnimo z belo."
            : "PNG in WebP ohranita prosojnost."}
        </p>
        <button
          className={styles.primary}
          disabled={!source || busy}
          onClick={() => void convert()}
        >
          Pripravi sliko
        </button>
        <button
          className={styles.clear}
          disabled={!source && !busy && !message}
          onClick={() => {
            invalidate();
            setSource(null);
            if (input.current) input.current.value = "";
          }}
        >
          Odstrani sliko in rezultat
        </button>
      </div>
      <div className={styles.panel}>
        <h2>03 · Preveri in prenesi.</h2>
        <div className={styles.preview} aria-busy={busy}>
          {result ? (
            // Local blob URL: no server image optimization or upload.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.url}
              alt="Predogled obdelane slike"
              width={result.width}
              height={result.height}
            />
          ) : (
            <div className={styles.empty}>
              <ImageIcon size={56} aria-hidden="true" />
              <p>Tvoja slika, pripravljena za splet.</p>
            </div>
          )}
        </div>
        <p role="status" aria-live="polite" className={styles.status}>
          {message || "Izberi sliko za začetek."}
        </p>
        {result && source && (
          <>
            <p className={styles.details}>
              {result.width} × {result.height} px · {sizeLabel(result.bytes)}
              <br />
              {result.bytes < source.bytes
                ? `${Math.round((1 - result.bytes / source.bytes) * 100)} % manjša datoteka`
                : "Rezultat ni manjši od izvirnika. Poskusi manjšo stranico ali nižjo kakovost."}
            </p>
            <a
              className={styles.primary}
              href={result.url}
              download={result.name}
            >
              Prenesi sliko
            </a>
          </>
        )}
        <p className={styles.privacy}>
          <LockKeyhole size={18} aria-hidden="true" /> Brez nalaganja fotografij
          na strežnik. Brez računa. Ob osvežitvi strani se slika in rezultat
          odstranita.
        </p>
      </div>
    </section>
  );
}
