export default function McKinseyLogo({ className = '', color = 'currentColor' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="McKinsey & Company"
    >
      <text
        x="0"
        y="16"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="600"
        fontSize="18"
        letterSpacing="0.02em"
        fill={color}
      >
        McKinsey
      </text>
      <text
        x="0"
        y="31"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="400"
        fontSize="13"
        letterSpacing="0.04em"
        fill={color}
      >
        &amp; Company
      </text>
    </svg>
  );
}
