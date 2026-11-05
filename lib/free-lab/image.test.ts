import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import {
  fitImage,
  imageFilename,
  inspectImage,
  MAX_IMAGE_BYTES,
} from "./image";
import { isPrivateToolPath } from "../private-tool-path";

const arrayBuffer = (b: Buffer) => Uint8Array.from(b).buffer;
test("real JPEG, PNG and lossy/lossless WebP headers report dimensions", async () => {
  const source = sharp({
    create: { width: 123, height: 77, channels: 4, background: "#00d67a88" },
  });
  for (const [format, buffer] of [
    ["jpeg", await source.clone().jpeg().toBuffer()],
    ["png", await source.clone().png().toBuffer()],
    ["webp", await source.clone().webp().toBuffer()],
    ["webp", await source.clone().webp({ lossless: true }).toBuffer()],
  ] as const)
    assert.deepEqual(inspectImage(arrayBuffer(buffer)), {
      format,
      width: 123,
      height: 77,
    });
});
test("image sizes preserve aspect ratio without upscaling", () => {
  assert.deepEqual(fitImage(6000, 4000, 1920), { width: 1920, height: 1280 });
  assert.deepEqual(fitImage(3000, 6000, 640), { width: 320, height: 640 });
  assert.deepEqual(fitImage(32, 16, 4096), { width: 32, height: 16 });
  assert.throws(() => fitImage(12000, 12000, 640));
  assert.throws(() => fitImage(0, 100, 640));
  assert.throws(() => fitImage(100, 100, 9999));
});
test("untrusted, oversize and truncated input is rejected before decoding", async () => {
  assert.throws(() => inspectImage(new ArrayBuffer(MAX_IMAGE_BYTES + 1)));
  assert.throws(() =>
    inspectImage(
      arrayBuffer(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')),
    ),
  );
  const png = await sharp({
    create: { width: 10, height: 10, channels: 4, background: "red" },
  })
    .png()
    .toBuffer();
  assert.throws(() => inspectImage(arrayBuffer(png.subarray(0, 35))));
  png.writeUInt32BE(100000, 16);
  assert.throws(() => inspectImage(arrayBuffer(png)));
});
test("animation headers are refused and output names cannot contain paths", () => {
  const webp = Buffer.alloc(30);
  webp.write("RIFF", 0);
  webp.writeUInt32LE(22, 4);
  webp.write("WEBPVP8X", 8);
  webp.writeUInt32LE(10, 16);
  webp[20] = 2;
  assert.throws(() => inspectImage(arrayBuffer(webp)), /Animirane/);
  assert.equal(
    imageFilename("../../photo.png", "jpeg"),
    "------photo-ju-tan.jpg",
  );
  assert.ok(isPrivateToolPath("/free/image-magic/"));
  assert.ok(isPrivateToolPath("https://ju-tan.com/free/image-magic?test=1"));
  assert.equal(isPrivateToolPath("/free/image-magic-other"), false);
});
