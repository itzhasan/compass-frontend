/**
 * The Al-Bawsala brand mark — a four-point compass star (long N/S spikes, shorter
 * E/W spikes), four diagonal rays and a small hub, set inside a chamfered square
 * frame. Pure outlined SVG that inherits its colour via `currentColor`, so the
 * same mark works as a small gold logo in the header and as a large faint motif
 * behind the hero. Safe to render on the server.
 */
export function CompassLogo({
  className,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden={ariaHidden}
    >
      {/* Chamfered square frame (octagon); round joins soften the corners. */}
      <path
        d="M104 30 L296 30 L370 104 L370 296 L296 370 L104 370 L30 296 L30 104 Z"
        strokeWidth="6"
      />

      {/* Diagonal rays (NE / NW / SE / SW) — thin, mid-length. */}
      <g strokeWidth="3">
        <line x1="210" y1="190" x2="268" y2="132" />
        <line x1="190" y1="190" x2="132" y2="132" />
        <line x1="210" y1="210" x2="268" y2="268" />
        <line x1="190" y1="210" x2="132" y2="268" />
      </g>

      {/* Four-point star: long vertical spikes, shorter horizontal spikes. */}
      <path
        d="M200 42 L211 189 L298 200 L211 211 L200 358 L189 211 L102 200 L189 189 Z"
        strokeWidth="6"
      />

      {/* Hub — a small vertical lens at the centre. */}
      <ellipse cx="200" cy="200" rx="9" ry="16" strokeWidth="6" />
    </svg>
  );
}
