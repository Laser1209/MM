export default function CentralGlow() {
  return (
    <svg
      className="absolute top-0 left-1/2 -translate-x-1/2 animate-scale-in delay-400 pointer-events-none"
      width="800"
      height="300"
      viewBox="0 0 800 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'blur(25px)' }}
    >
      <ellipse
        cx="400"
        cy="150"
        rx="320"
        ry="100"
        fill="rgba(94, 210, 156, 0.15)"
      />
      <ellipse
        cx="400"
        cy="120"
        rx="200"
        ry="60"
        fill="rgba(94, 210, 156, 0.12)"
      />
    </svg>
  )
}
