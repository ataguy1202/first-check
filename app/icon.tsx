import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#a3e635" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="14" stroke="url(#g)" strokeWidth="2.5" fill="none" />
          <path
            d="M 9 16 L 14 21 L 23 11"
            stroke="url(#g)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
