import { ImageResponse } from "next/og";

export const alt = "First Check · your NIL & contract AI assistant.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle 700px at 90% -10%, rgba(163, 230, 53, 0.14), transparent 60%), radial-gradient(circle 600px at 0% 60%, rgba(245, 158, 11, 0.06), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="og-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#a3e635" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" stroke="url(#og-g)" strokeWidth="2.5" fill="none" />
            <path
              d="M 9 16 L 14 21 L 23 11"
              stroke="url(#og-g)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>first check</div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
              fontSize: 14,
              fontFamily: "ui-monospace, SFMono-Regular",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "rgba(250, 250, 250, 0.5)",
            }}
          >
            <span style={{ width: 6, height: 6, background: "#a3e635", borderRadius: 999 }} />
            post 3 · ai tool series
          </div>
          <div style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "-0.035em", fontWeight: 600 }}>
            Your first big check
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              fontWeight: 600,
              background: "linear-gradient(135deg, #a3e635, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            deserves a plan.
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 28,
              maxWidth: 940,
              lineHeight: 1.25,
              color: "rgba(250, 250, 250, 0.75)",
            }}
          >
            Your NIL & contract AI assistant. Reads your deal, builds your plan, 60 seconds. Free.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {[
            ["100K+", "athletes with NIL"],
            ["$1.95B", "2025 market"],
            ["9%", "have an advisor"],
            ["$0", "fees"],
          ].map(([v, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>{v}</div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "ui-monospace, SFMono-Regular",
                  textTransform: "uppercase",
                  letterSpacing: "0.22em",
                  color: "rgba(250, 250, 250, 0.4)",
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
