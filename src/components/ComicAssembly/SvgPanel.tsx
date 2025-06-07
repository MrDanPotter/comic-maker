import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { Panel, BoundingBox } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import PanelImage from './PanelImage';

interface SvgPanelProps {
  panel: Panel;
  pageId: string;
}

const PanelContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const SvgPanel: React.FC<SvgPanelProps> = ({ panel, pageId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });

  const svgPath = pointsToSvgPath(panel.points);
  const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !panel.imageUrl) return;

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
  }, [isDragging, dragStart, panel.imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panel.imageUrl) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    });
  };

  return (
    <PanelContainer>
      <Droppable droppableId={`${pageId}-${panel.id}`} type="IMAGE_LIBRARY">
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
        {panel.imageUrl && (
          <PanelImage
            src={panel.imageUrl}
            panelId={panel.id}
            width={dropZone.width}
            height={dropZone.height}
            position={position}
            points={panel.points}
          />
        )}

        <PanelPolygon
          d={svgPath}
          fill={panel.imageUrl ? `url(#pattern-${panel.id})` : '#f5f5f5'}
          onMouseDown={handleMouseDown}
        />
      </PanelSvg>
    </PanelContainer>
  );
};

export default SvgPanel;
