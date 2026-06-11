/**
 * First Check wordmark + glyph. A small check mark in a circle with the
 * signature green gradient.
 */
export function Brand({ size = 24 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="fc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(88 80% 60%)" />
            <stop offset="100%" stopColor="hsl(38 92% 60%)" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14" stroke="url(#fc-grad)" strokeWidth="2.5" fill="none" />
        <path
          d="M 9 16 L 14 21 L 23 11"
          stroke="url(#fc-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="display tracking-tight text-fg" style={{ fontSize: size * 0.62 }}>
        first check
      </span>
    </span>
  );
}

export function BrandGlyph({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`fc-g-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(88 80% 60%)" />
          <stop offset="100%" stopColor="hsl(38 92% 60%)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke={`url(#fc-g-${size})`} strokeWidth="2.5" fill="none" />
      <path
        d="M 9 16 L 14 21 L 23 11"
        stroke={`url(#fc-g-${size})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
