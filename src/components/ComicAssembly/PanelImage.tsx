import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { calculateImageScale, calculateMaxOffset, constrainPosition } from '../../utils/mathUtils';

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
        const containerDimensions = {
          width: container.clientWidth,
          height: container.clientHeight
        };
        const newScale = calculateImageScale(containerDimensions, {
          width: img.width,
          height: img.height
        });
        setScale(newScale);
      }
    };
    img.src = src;
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerDimensions = {
      width: container.clientWidth,
      height: container.clientHeight
    };

    // Calculate new position
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    const maxOffset = calculateMaxOffset(
      containerDimensions,
      imageDimensions,
      scale
    );

    // Constrain movement within bounds
    const constrainedPosition = constrainPosition(newPosition, maxOffset);
    setPosition(constrainedPosition);
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