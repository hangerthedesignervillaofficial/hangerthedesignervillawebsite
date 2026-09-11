// Signature Hanger Logo SVG — contained original brand hanger inside villa/house boundary
// No stray elements outside the boundary; preserves authentic brand hanger geometry

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
      {/* Outer Villa / House Boundary */}
      <path
        d="M 50 15 
           L 82 36 
           Q 85 38 85 43 
           L 85 81 
           Q 85 89 77 89 
           L 23 89 
           Q 15 89 15 81 
           L 15 43 
           Q 15 38 18 36 
           Z"
        stroke={color}
        strokeWidth="3.8"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Signature Brand Hanger: Hook flows into right slope & base; Left arm with iconic designer gap */}
      <path
        d="M 43.5 45
           C 43.5 39 46.5 35 51 35
           C 55.5 35 58.5 38.5 58 43
           C 57.5 47 53 49.5 52 54
           L 73.5 67.5
           C 75.5 68.8 75.5 71 73 71
           L 27 71
           C 24.5 71 24.5 68.8 26.5 67.5
           L 45.5 56"
        stroke={color}
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
