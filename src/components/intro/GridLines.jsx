export default function GridLines() {
  return (
    <div className="absolute inset-0 hidden md:block pointer-events-none">
      {[25, 50, 75].map((pos) => (
        <div
          key={pos}
          className="absolute top-0 bottom-0 animate-fade-in delay-200"
          style={{
            left: `${pos}%`,
            width: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}
    </div>
  )
}
