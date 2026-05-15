import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Props Voice｜QRを置くだけで、来店客の声が Google レビューになる";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1F2D40",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Props Lab presents
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -2,
            }}
          >
            Props Voice
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            QRを置くだけで、来店客の声が
            <br />
            Google レビューになる。
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>無料で始める　voice.props-lab.com</span>
          <span style={{ letterSpacing: 4 }}>★★★★★</span>
        </div>
      </div>
    ),
    size
  );
}
