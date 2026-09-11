// Clean Hanger Logo SVG — contained hanger inside a villa/house shape
// No stray elements outside the boundary

export function HangerLogo({
  className = "h-10 w-auto",
  color = "#D4AF37",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="Hanger The Designer Villa Logo"
    >
      {/* Outer pentagon/house shape with rounded bottom corners */}
      <path
        d="M50 10 L90 42 L90 88 Q90 93 85 93 L15 93 Q10 93 10 88 L10 42 Z"
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Inner hanger — hook at top center */}
      <path
        d="M50 42 C50 38 55 36 57 39 C59 42 55 46 50 49"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Hanger left arm */}
      <path
        d="M50 49 C40 54 24 60 22 68"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hanger right arm */}
      <path
        d="M50 49 C60 54 76 60 78 68"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hanger bar */}
      <line
        x1="22"
        y1="68"
        x2="78"
        y2="68"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Bottom left notch */}
      <path
        d="M22 68 C20 72 22 75 26 73"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Bottom right notch */}
      <path
        d="M78 68 C80 72 78 75 74 73"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
