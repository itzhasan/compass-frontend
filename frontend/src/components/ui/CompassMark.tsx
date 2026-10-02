/**
 * The Al-Bawsala compass dial — a decorative SVG of concentric rings, graduated
 * tick marks and a cross-hair, with a gold needle. Used as a faint background
 * motif in hero/header bands (color is inherited via `currentColor`) and as the
 * brand mark. Pure SVG, safe to render on the server.
 */
export function CompassMark({
  className,
  showNeedle = false,
  needleOnly = false,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  /** Render the gold compass needle on top of the dial. */
  showNeedle?: boolean;
  /** Render ONLY the needle (no rings/ticks) — for overlaying on a faint dial. */
  needleOnly?: boolean;
  "aria-hidden"?: boolean;
}) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  const needle = (
    <g stroke="none">
      <path d="M200 92 L210 200 L200 210 L190 200 Z" fill="var(--color-accent)" />
      <path d="M200 308 L190 200 L200 190 L210 200 Z" fill="currentColor" fillOpacity="0.35" />
      <circle cx="200" cy="200" r="7" fill="var(--color-accent)" />
      <circle cx="200" cy="200" r="2.5" fill="var(--color-ink)" />
    </g>
  );

  if (needleOnly) {
    return (
      <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden={ariaHidden}>
        {needle}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden={ariaHidden}
    >
      {/* Concentric rings */}
      <circle cx="200" cy="200" r="196" strokeWidth="1" />
      <circle cx="200" cy="200" r="150" strokeWidth="1" />
      <circle cx="200" cy="200" r="104" strokeWidth="1" />
      <circle cx="200" cy="200" r="58" strokeWidth="1" />

      {/* Cross-hair + diagonals */}
      <line x1="200" y1="4" x2="200" y2="396" strokeWidth="0.75" />
      <line x1="4" y1="200" x2="396" y2="200" strokeWidth="0.75" />
      <line x1="59" y1="59" x2="341" y2="341" strokeWidth="0.5" />
      <line x1="341" y1="59" x2="59" y2="341" strokeWidth="0.5" />

      {/* Graduated ticks around the outer ring */}
      <g strokeWidth="1">
        {ticks.map((i) => {
          const major = i % 6 === 0;
          const a = (i / ticks.length) * Math.PI * 2;
          const r1 = 196;
          const r2 = major ? 176 : 186;
          // Round to 2dp so server and client serialize identical strings (avoids
          // a hydration mismatch from floating-point precision differences).
          const round = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={round(200 + Math.cos(a) * r1)}
              y1={round(200 + Math.sin(a) * r1)}
              x2={round(200 + Math.cos(a) * r2)}
              y2={round(200 + Math.sin(a) * r2)}
              strokeOpacity={major ? 1 : 0.5}
            />
          );
        })}
      </g>

      {showNeedle ? needle : null}
    </svg>
  );
}
