export const palettes = [
  { name: "JU-TAN", color: "#087641" },
  { name: "Klasika", color: "#101820" },
  { name: "Ocean", color: "#154E75" },
  { name: "Vijolična", color: "#5B3285" },
  { name: "Bordo", color: "#8A2444" },
  { name: "Bron", color: "#785027" },
] as const;
export const exportSizes = [512, 1024, 2048] as const;
export type ExportSize = (typeof exportSizes)[number];
export type QrMatrix = { size: number; data: Uint8Array };
export const QUIET_ZONE = 4;

function validateOptions(color: string, pixels: number) {
  if (
    !palettes.some((palette) => palette.color === color) ||
    !exportSizes.includes(pixels as ExportSize)
  )
    throw new Error("Invalid QR export options");
}

export function qrPath(matrix: QrMatrix) {
  let path = "";
  for (let row = 0; row < matrix.size; row++) {
    for (let col = 0; col < matrix.size; col++) {
      if (matrix.data[row * matrix.size + col])
        path += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`;
    }
  }
  return path;
}

export function qrSvg(matrix: QrMatrix, color: string, pixels: ExportSize) {
  validateOptions(color, pixels);
  const side = matrix.size + QUIET_ZONE * 2;
  // Only numeric module geometry and an allowlisted color enter the SVG, never user text.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${pixels}" viewBox="0 0 ${side} ${side}" shape-rendering="crispEdges"><rect width="${side}" height="${side}" fill="#ffffff"/><path fill="${color}" d="${qrPath(matrix)}"/></svg>`;
}

export function qrRaster(matrix: QrMatrix, color: string, pixels: ExportSize) {
  validateOptions(color, pixels);
  const output = new Uint8ClampedArray(pixels * pixels * 4).fill(255);
  const rgb = [1, 3, 5].map((offset) =>
    parseInt(color.slice(offset, offset + 2), 16),
  );
  const scale = Math.floor(pixels / (matrix.size + QUIET_ZONE * 2));
  const offset = Math.floor((pixels - matrix.size * scale) / 2);
  for (let row = 0; row < matrix.size; row++) {
    for (let col = 0; col < matrix.size; col++) {
      if (!matrix.data[row * matrix.size + col]) continue;
      for (let y = 0; y < scale; y++) {
        for (let x = 0; x < scale; x++) {
          const index =
            ((offset + row * scale + y) * pixels + offset + col * scale + x) *
            4;
          output[index] = rgb[0];
          output[index + 1] = rgb[1];
          output[index + 2] = rgb[2];
        }
      }
    }
  }
  return output;
}
