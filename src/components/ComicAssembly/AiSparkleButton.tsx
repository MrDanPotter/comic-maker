import React from 'react';

interface SvgAiSparkleButtonProps {
  onClick: () => void;
  isVisible: boolean;
  x: number;
  y: number;
  size?: number;
}

// SVG version of the sparkle button
const SvgAiSparkleButton: React.FC<SvgAiSparkleButtonProps> = ({ 
  onClick, 
  isVisible, 
  x, 
  y, 
  size = 40 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const radius = size / 2;
  const centerX = x + radius;
  const centerY = y + radius;
  
  return (
    <g
      className="AiSparkleButton"
      opacity={isVisible ? 1 : 0}
      transform={`translate(${centerX}, ${centerY}) ${isHovered ? 'scale(1.05)' : 'scale(1)'} translate(${-centerX}, ${-centerY})`}
      style={{
        cursor: 'pointer',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'transform 0.2s ease'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Button background with gradient */}
      <defs>
        <radialGradient id={`sparkle-gradient-${x}-${y}`}>
          <stop offset="0%" stopColor={isHovered ? "#a0b2f0" : "#8fa1e8"} />
          <stop offset="100%" stopColor={isHovered ? "#ac8dc8" : "#9b7bb8"} />
        </radialGradient>
        <filter id={`sparkle-shadow-${x}-${y}`}>
          <feDropShadow dx="0" dy="4" stdDeviation={isHovered ? "8" : "6"} floodColor="rgba(102, 126, 234, 0.3)" />
        </filter>
      </defs>
      
      {/* Main button circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill={`url(#sparkle-gradient-${x}-${y})`}
        stroke="#000"
        strokeWidth="2"
      />
      
      {/* Sparkle icon (3 stars in triangular pattern) */}
      <g transform={`translate(${centerX}, ${centerY})`}>
        {/* Star 1 (top) - largest */}
        <path
          d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.7" />
        
        {/* Star 2 (bottom left) - medium */}
        <path
          d="M-6,4 L-4.5,7 L-1,8 L-4.5,9 L-6,12 L-7.5,9 L-11,8 L-7.5,7 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="-6" cy="8" r="1.5" fill="white" opacity="0.7" />
        
        {/* Star 3 (bottom right) - smallest */}
        <path
          d="M6,4 L7.5,7 L11,8 L7.5,9 L6,12 L4.5,9 L1,8 L4.5,7 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="6" cy="8" r="1" fill="white" opacity="0.7" />
      </g>
      

    </g>
  );
};

// Export the SVG version as the default
const AiSparkleButton = SvgAiSparkleButton;

export default AiSparkleButton;
export { SvgAiSparkleButton }; 