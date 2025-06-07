import React, { useState, useEffect } from 'react';

interface PanelImageProps {
  src: string;
  alt: string;
  panelId: string;
  width: number;
  height: number;
}

const PanelImage: React.FC<PanelImageProps> = ({ src, alt, panelId, width, height }) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const patternId = `pattern-${panelId}`;

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = src;
  }, [src]);

  // Calculate scale to cover the panel
  const scale = Math.max(
    width / imageDimensions.width,
    height / imageDimensions.height
  );

  const scaledWidth = imageDimensions.width * scale;
  const scaledHeight = imageDimensions.height * scale;

  // Center the image in the pattern
  const baseX = (width - scaledWidth) / 2;
  const baseY = (height - scaledHeight) / 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Calculate maximum allowed movement
    const maxOffsetX = Math.max(0, (scaledWidth - width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - height) / 2);

    // Update position with constraints
    setPosition({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, dragStart.posX + dx)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, dragStart.posY + dy))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <defs>
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={width}
        height={height}
        patternContentUnits="userSpaceOnUse"
      >
        <rect
          width={width}
          height={height}
          fill="transparent"
          style={{ cursor: 'move' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <image
          href={src}
          x={baseX + position.x}
          y={baseY + position.y}
          width={scaledWidth}
          height={scaledHeight}
          preserveAspectRatio="xMidYMid slice"
          style={{ pointerEvents: 'none' }}
        />
      </pattern>
    </defs>
  );
};

export default PanelImage; 