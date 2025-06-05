import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface PanelImageProps {
  src: string;
  alt: string;
}

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const DraggableImage = styled.img<{ $x: number; $y: number; $scale: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(calc(-50% + ${props => props.$x}px), calc(-50% + ${props => props.$y}px)) scale(${props => props.$scale});
  cursor: move;
  user-select: none;
  transform-origin: center;
`;

const PanelImage: React.FC<PanelImageProps> = ({ src, alt }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Load image dimensions and calculate initial scale
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      
      if (containerRef.current) {
        const container = containerRef.current;
        const containerAspect = container.clientWidth / container.clientHeight;
        const imageAspect = img.width / img.height;
        
        // Scale the image so its largest dimension matches the panel's smallest dimension
        if (imageAspect > containerAspect) {
          // Image is wider than container
          const scale = container.clientWidth / img.width;
          setScale(scale);
        } else {
          // Image is taller than container
          const scale = container.clientHeight / img.height;
          setScale(scale);
        }
      }
    };
    img.src = src;
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const scaledWidth = imageDimensions.width * scale;
    const scaledHeight = imageDimensions.height * scale;
    
    // Calculate new position
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // Calculate bounds
    const maxOffset = {
      x: (scaledWidth - container.clientWidth) / 2,
      y: (scaledHeight - container.clientHeight) / 2
    };

    // Constrain movement within bounds
    newX = Math.max(-maxOffset.x, Math.min(maxOffset.x, newX));
    newY = Math.max(-maxOffset.y, Math.min(maxOffset.y, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ImageContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <DraggableImage
        src={src}
        alt={alt}
        $x={position.x}
        $y={position.y}
        $scale={scale}
        draggable={false}
      />
    </ImageContainer>
  );
};

export default PanelImage; 