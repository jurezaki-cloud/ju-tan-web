import { ImageResponse } from "next/og";

export const alt = "JU-TAN FREE LAB — Ustvari. Uredi. Odkrij.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#050816",
        padding: "70px 80px",
        color: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 6,
          color: "#00d67a",
        }}
      >
        JU-TAN STUDIO / FREE LAB
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 102,
          fontWeight: 700,
          marginTop: 55,
        }}
      >
        Ustvari. Uredi.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 102,
          fontWeight: 700,
          color: "#00d67a",
        }}
      >
        Odkrij.
      </div>
      <div style={{ display: "flex", marginTop: 38, fontSize: 28 }}>
        Majhna orodja. Velike možnosti. / ju-tan.com/free
      </div>
    </div>,
    size,
  );
}
