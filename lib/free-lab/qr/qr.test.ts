import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";
import jsQR from "jsqr";
import sharp from "sharp";
import {
  buildQrPayload,
  initialFields,
  type QrFields,
  type QrKind,
} from "./payload";
import {
  exportSizes,
  palettes,
  qrRaster,
  qrSvg,
  type QrMatrix,
} from "./render";
import { isPrivateToolPath } from "../../private-tool-path";

function payload(kind: QrKind, fields: Partial<QrFields>) {
  const result = buildQrPayload(kind, { ...initialFields, ...fields });
  assert.equal(result.ok, true, !result.ok ? result.error : "");
  if (!result.ok) throw new Error("Invalid fixture");
  return result.data;
}
const samples: [QrKind, Partial<QrFields>][] = [
  ["url", { url: "https://example.com/čaj?q=šumniki&n=1#del" }],
  [
    "wifi",
    { ssid: 'Čaj;Guest,"A"\\', password: 'p;ass:"word\\123', hidden: "true" },
  ],
  [
    "email",
    {
      email: "ana+test@example.com",
      subject: "Živjo & čestitke",
      message: "Prva vrstica\nDruga vrstica 🎉",
    },
  ],
  ["phone", { phone: "+386 (40) 123-456" }],
  ["sms", { phone: "+38640123456", message: "Čestitke! & # + 🎉" }],
  [
    "contact",
    {
      firstName: "Ana",
      lastName: "Šubic",
      organization: "Studio, d.o.o.; oblikovanje",
      email: "ana@example.com",
      phone: "+38640123456",
      website: "example.com",
    },
  ],
];

test("all six payload types survive independent QR decoding in every palette", () => {
  for (const [kind, fields] of samples) {
    const data = payload(kind, fields);
    const matrix = QRCode.create(data, { errorCorrectionLevel: "Q" }).modules;
    for (const palette of palettes) {
      assert.equal(
        jsQR(qrRaster(matrix, palette.color, 512), 512, 512)?.data,
        data,
        `${kind}: ${palette.name}`,
      );
    }
  }
});

test("SVG and PNG exports retain dimensions, white border and decodable content", async () => {
  const data = payload("wifi", samples[1][1]);
  const matrix = QRCode.create(data, { errorCorrectionLevel: "Q" }).modules;
  for (const pixels of exportSizes) {
    const raw = qrRaster(matrix, palettes[0].color, pixels);
    assert.deepEqual(
      Array.from(raw.subarray(0, pixels * 4)),
      Array(pixels * 4).fill(255),
    );
    const png = await sharp(Buffer.from(raw), {
      raw: { width: pixels, height: pixels, channels: 4 },
    })
      .png()
      .toBuffer();
    const decodedPng = await sharp(png).ensureAlpha().raw().toBuffer();
    assert.equal(
      jsQR(new Uint8ClampedArray(decodedPng), pixels, pixels)?.data,
      data,
    );
    const svg = qrSvg(matrix, palettes[0].color, pixels);
    const raster = await sharp(Buffer.from(svg))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(raster.info.width, pixels);
    assert.equal(
      jsQR(new Uint8ClampedArray(raster.data), pixels, pixels)?.data,
      data,
    );
    assert.ok(!svg.includes("WIFI:"), "No plaintext payload in SVG metadata");
  }
});

test("Wi-Fi escaping preserves special characters and omits stale passwords for open networks", () => {
  assert.equal(
    payload("wifi", {
      ssid: 'A;B:C,D\\E"',
      password: "hello:world",
      hidden: "true",
    }),
    'WIFI:T:WPA;S:A\\;B\\:C\\,D\\\\E\\";P:hello\\:world;H:true;;',
  );
  const open = payload("wifi", {
    ssid: "Guest",
    password: "should-not-leak",
    security: "nopass",
  });
  assert.equal(open, "WIFI:T:nopass;S:Guest;H:false;;");
  assert.equal(
    buildQrPayload("wifi", {
      ...initialFields,
      ssid: "č".repeat(17),
      password: "12345678",
    }).ok,
    false,
  );
  assert.equal(
    buildQrPayload("wifi", { ...initialFields, ssid: "Guest", password: "123" })
      .ok,
    false,
  );
});

test("payload validation rejects unsafe protocols, header injection and excessive data", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "ftp://example.com",
    "https://user:pass@example.com",
    "https://example.com\n/path",
    "",
  ])
    assert.equal(buildQrPayload("url", { ...initialFields, url }).ok, false);
  assert.equal(payload("url", { url: "example.com" }), "https://example.com/");
  assert.equal(
    buildQrPayload("contact", { ...initialFields, firstName: "Ana\r\nTEL:123" })
      .ok,
    false,
  );
  assert.equal(
    buildQrPayload("email", {
      ...initialFields,
      email: "a@example.com\r\nBcc:x@example.com",
    }).ok,
    false,
  );
  assert.equal(
    buildQrPayload("sms", {
      ...initialFields,
      phone: "+123456",
      message: "🎉".repeat(100),
    }).ok,
    false,
  );
  assert.equal(
    buildQrPayload("phone", { ...initialFields, phone: "123?body=bad" }).ok,
    false,
  );
});

test("vCard keeps accented names and escapes separators without line injection", () => {
  const data = payload("contact", {
    firstName: "Črt",
    lastName: "Žagar",
    organization: "A;B,C\\D",
  });
  assert.ok(data.includes("FN:Črt Žagar"));
  assert.ok(data.includes("N:Žagar;Črt;;;"));
  assert.ok(data.includes("ORG:A\\;B\\,C\\\\D"));
  const folded = payload("contact", {
    firstName: "Ž".repeat(60),
    lastName: "Novak",
  });
  assert.ok(
    folded
      .split("\r\n")
      .every((line) => new TextEncoder().encode(line).length <= 75),
  );
});

test("1000-byte payload remains decodable at the smallest export size", () => {
  const data = "https://example.com/" + "a".repeat(980);
  assert.equal(new TextEncoder().encode(data).length, 1000);
  const matrix = QRCode.create(data, { errorCorrectionLevel: "Q" }).modules;
  assert.equal(
    jsQR(qrRaster(matrix, palettes[0].color, 512), 512, 512)?.data,
    data,
  );
});

test("only approved colors and dimensions enter downloadable SVG", () => {
  const matrix: QrMatrix = QRCode.create("safe", {
    errorCorrectionLevel: "Q",
  }).modules;
  assert.throws(() => qrSvg(matrix, '\" onload=\"alert(1)', 512));
  assert.throws(() => qrRaster(matrix, "#ffffff", 512));
});

test("telemetry exclusions cover direct visits, trailing slash and client-side navigation URLs", () => {
  for (const path of [
    "/free/qr-studio",
    "/free/qr-studio/",
    "https://ju-tan.com/free/qr-studio?x=1",
    "/magic#message",
  ])
    assert.equal(isPrivateToolPath(path), true);
  for (const path of ["/free", "/free/qr-studio-other", "/kontakt"])
    assert.equal(isPrivateToolPath(path), false);
});
