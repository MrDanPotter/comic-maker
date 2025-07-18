import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Point, BoundingBox } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';

interface PanelImageProps {
  src: string;
  panelId: string;
  pageId: string;
  width: number;
  height: number;
  points: Point[];
  dropZone: BoundingBox;
  isResizing?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PanelPolygon = styled.path<{ $isDragging: boolean; $isResizing: boolean }>`
  stroke: #333;
  stroke-width: 2px;
  cursor: move;
  transition: ${props => (props.$isDragging || props.$isResizing) ? 'none' : 'd 0.5s ease-in-out'};
`;

const PreviewImage = styled.image<{ $isDragging: boolean; $isResizing: boolean }>`
  opacity: ${props => props.$isDragging ? 0.33 : 0};
  pointer-events: none;
  transition: opacity 0.2s ease;
`;

const PatternImage = styled.image<{ $isDragging: boolean; $isResizing: boolean }>`
  pointer-events: none;
  transition: ${props => (props.$isDragging || props.$isResizing) ? 'none' : 'd 0.5s ease-in-out'};
`;

const PanelImage: React.FC<PanelImageProps> = ({
  src,
  panelId,
  width,
  height,
  points,
  isResizing = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const svgPath = pointsToSvgPath(points);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPosition({
        x: dragStart.posX + dx,
        y: dragStart.posY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

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

  const scale = Math.max(
    width / imageDimensions.width,
    height / imageDimensions.height
  );

  const scaledWidth = imageDimensions.width * scale;
  const scaledHeight = imageDimensions.height * scale;

  const baseX = (width - scaledWidth) / 2;
  const baseY = (height - scaledHeight) / 2;

  const panelOffsetX = Math.min(...points.map(p => p[0]));
  const panelOffsetY = Math.min(...points.map(p => p[1]));

  // Calculate the absolute position of the image for the preview
  const absoluteX = panelOffsetX + baseX + position.x;
  const absoluteY = panelOffsetY + baseY + position.y;

  return (
    <>
      {/* Main clipped image */}
      <defs>
        <pattern
          id={`pattern-${panelId}`}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={panelOffsetX}
          y={panelOffsetY}
          width={width}
          height={height}
        >
          <PatternImage
            href={src}
            x={baseX + position.x}
            y={baseY + position.y}
            width={scaledWidth}
            height={scaledHeight}
            preserveAspectRatio="xMidYMid slice"
            style={{ pointerEvents: 'none' }}
            $isDragging={isDragging}
            $isResizing={isResizing}
          />
        </pattern>
      </defs>

      {/* Full image preview layer */}
      <PreviewImage
        href={src}
        x={absoluteX}
        y={absoluteY}
        width={scaledWidth}
        height={scaledHeight}
        preserveAspectRatio="xMidYMid slice"
        $isDragging={isDragging}
        $isResizing={isResizing}
      />

      {/* Panel with clipped image */}
      <PanelPolygon
        d={svgPath}
        fill={`url(#pattern-${panelId})`}
        onMouseDown={handleMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        $isDragging={isDragging}
        $isResizing={isResizing}
      />
    </>
  );
};

export default PanelImage;
