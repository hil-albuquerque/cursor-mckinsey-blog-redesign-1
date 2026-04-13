export default function McKinseyLogo({ className = '', color = 'currentColor' }) {
  return (
    <svg className={className} viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="0"
        y="18"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="16"
        letterSpacing="0.15em"
        fill={color}
      >
        McKINSEY
      </text>
      <text
        x="120"
        y="18"
        fontFamily="'Inter', sans-serif"
        fontWeight="400"
        fontSize="11"
        letterSpacing="0.08em"
        fill={color}
        opacity="0.7"
      >
        BLOG
      </text>
    </svg>
  );
}
