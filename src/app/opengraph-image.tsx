import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "creativekat.studio — small, careful digital products";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#1a1820",
          color: "#ece9e2",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -100,
            width: 800,
            height: 600,
            background:
              "radial-gradient(closest-side, rgba(139,92,246,0.55), transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -100,
            width: 700,
            height: 500,
            background:
              "radial-gradient(closest-side, rgba(59,130,246,0.5), transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        {/* logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6d28d9, #4f46e5, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            k
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#9b958d",
              display: "flex",
            }}
          >
            creativekat.studio
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1.05,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>Small,&nbsp;</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #8b5cf6, #6366f1, #3b82f6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              careful
            </span>
            <span>&nbsp;digital products.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#9b958d",
              maxWidth: 900,
              display: "flex",
            }}
          >
            A studio for tools and experiments — built with the kind of
            attention you usually only get on personal projects.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 18,
            color: "#9b958d",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>est. 2026</span>
          <span>creativekat.studio</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
