import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
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
}

const DroppableOverlay = styled.div<{ $dropZone: BoundingBox }>`
  position: absolute;
  top: ${props => props.$dropZone.top}px;
  left: ${props => props.$dropZone.left}px;
  width: ${props => props.$dropZone.width}px;
  height: ${props => props.$dropZone.height}px;
  pointer-events: none;
  z-index: 0;

  &.dragging-over {
    pointer-events: all;
    z-index: 2;
    background: rgba(224, 224, 224, 0.5);
    border: 2px dashed #666;
  }
`;

const PanelSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const PanelPolygon = styled.path`
  stroke: #333;
  stroke-width: 2px;
  cursor: move;
`;

const PanelImage: React.FC<PanelImageProps> = ({
  src,
  panelId,
  pageId,
  width,
  height,
  points,
  dropZone
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

  return (
    <>
      <Droppable droppableId={`${pageId}-${panelId}`} type="IMAGE_LIBRARY">
        {(provided, snapshot) => (
          <DroppableOverlay
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={snapshot.isDraggingOver ? 'dragging-over' : ''}
            $dropZone={dropZone}
          >
            {provided.placeholder}
          </DroppableOverlay>
        )}
      </Droppable>

      <PanelSvg>
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

        <PanelPolygon
          d={svgPath}
          fill={`url(#pattern-${panelId})`}
          onMouseDown={handleMouseDown}
        />
      </PanelSvg>
    </>
  );
};

export default PanelImage;
