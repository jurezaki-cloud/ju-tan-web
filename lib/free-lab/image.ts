export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const formats = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;
export type ImageFormat = keyof typeof formats;
export const imageEdges = [640, 1280, 1920, 2560, 4096] as const;

export function checkDimensions(width: number, height: number) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > 12000 ||
    height > 12000 ||
    width * height > 24_000_000
  )
    throw new Error(
      "Slika je prevelika. Izberi največ 24 milijonov slikovnih pik in največ 12.000 px na stranico.",
    );
}

/** Read bounded container headers before asking the browser to allocate decoded pixels. */
export function inspectImage(buffer: ArrayBuffer) {
  if (!buffer.byteLength || buffer.byteLength > MAX_IMAGE_BYTES)
    throw new Error("Izberi sliko do 20 MB.");
  const b = new Uint8Array(buffer),
    v = new DataView(buffer);
  const text = (at: number, size: number) =>
    String.fromCharCode(...b.subarray(at, at + size));
  let width = 0,
    height = 0;
  let format: ImageFormat;
  if (
    b.length >= 33 &&
    b[0] === 137 &&
    text(1, 3) === "PNG" &&
    v.getUint32(4) === 0x0d0a1a0a &&
    text(12, 4) === "IHDR"
  ) {
    format = "png";
    width = v.getUint32(16);
    height = v.getUint32(20);
    checkDimensions(width, height);
    let ended = false;
    for (let at = 8; at + 12 <= b.length;) {
      const size = v.getUint32(at);
      if (at + size + 12 > b.length)
        throw new Error("Datoteka PNG je nepopolna.");
      if (text(at + 4, 4) === "acTL")
        throw new Error("Animirane slike niso podprte. Izberi statično sliko.");
      if (text(at + 4, 4) === "IEND") { ended = true; break; }
      at += size + 12;
    }
    if (!ended) throw new Error("Datoteka PNG je nepopolna.");
  } else if (b.length >= 12 && text(0, 4) === "RIFF" && text(8, 4) === "WEBP") {
    format = "webp";
    for (let at = 12; at + 8 <= b.length;) {
      const size = v.getUint32(at + 4, true),
        start = at + 8,
        kind = text(at, 4);
      if (start + size > b.length)
        throw new Error("Datoteka WebP je nepopolna.");
      if (
        kind === "ANIM" ||
        kind === "ANMF" ||
        (kind === "VP8X" && size >= 10 && b[start] & 2)
      )
        throw new Error("Animirane slike niso podprte. Izberi statično sliko.");
      if (kind === "VP8X" && size >= 10) {
        width = 1 + b[start + 4] + (b[start + 5] << 8) + (b[start + 6] << 16);
        height = 1 + b[start + 7] + (b[start + 8] << 8) + (b[start + 9] << 16);
      } else if (kind === "VP8 " && size >= 10) {
        width = v.getUint16(start + 6, true) & 0x3fff;
        height = v.getUint16(start + 8, true) & 0x3fff;
      } else if (kind === "VP8L" && size >= 5) {
        const bits = v.getUint32(start + 1, true);
        width = 1 + (bits & 0x3fff);
        height = 1 + ((bits >>> 14) & 0x3fff);
      }
      if (width && height) checkDimensions(width, height);
      at = start + size + (size % 2);
    }
  } else if (b.length >= 4 && b[0] === 255 && b[1] === 216) {
    format = "jpeg";
    for (let at = 2; at + 3 < b.length;) {
      if (b[at++] !== 255) break;
      while (b[at] === 255) at++;
      const marker = b[at++];
      if (marker === 0xda || marker === 0xd9) break;
      if (at + 2 > b.length) break;
      const size = v.getUint16(at);
      if (size < 2 || at + size > b.length) break;
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker) &&
        size >= 8
      ) {
        height = v.getUint16(at + 3);
        width = v.getUint16(at + 5);
        break;
      }
      at += size;
    }
  } else
    throw new Error(
      "Podprte so slike JPG, PNG in WebP. SVG, GIF in HEIC niso podprti.",
    );
  checkDimensions(width, height);
  return { width, height, format };
}

export function fitImage(width: number, height: number, edge: number) {
  checkDimensions(width, height);
  if (!imageEdges.includes(edge as (typeof imageEdges)[number]))
    throw new Error("Neveljavna velikost izvoza.");
  const scale = Math.min(1, edge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function imageFilename(name: string, format: ImageFormat) {
  const stem =
    name
      .replace(/\.[^.]*$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 70) || "slika";
  return `${stem}-ju-tan.${format === "jpeg" ? "jpg" : format}`;
}
