import React from "react";

export function SimpleRetroGrid({ 
  angle = 65, 
  cellSize = 60, 
  opacity = 0.4, 
  lineColor = "#064EE3" 
}) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        perspective: "200px",
        opacity: opacity
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          transform: `rotateX(${angle}deg)`
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${lineColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0"
          }}
        />
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,0.05) 0%, transparent 90%)" }}
      />
    </div>
  );
}