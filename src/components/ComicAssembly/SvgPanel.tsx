import React from 'react';
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
  pointer-events: none;
`;

const PanelSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const PanelPolygon = styled.path`
  fill: #f5f5f5;
  stroke: #333;
  stroke-width: 2px;
`;

const DroppableOverlay = styled.div<{ $dropZone: BoundingBox }>`
  position: absolute;
  top: ${props => props.$dropZone.top}px;
  left: ${props => props.$dropZone.left}px;
  width: ${props => props.$dropZone.width}px;
  height: ${props => props.$dropZone.height}px;
  pointer-events: auto;
  
  &.dragging-over {
    background: rgba(224, 224, 224, 0.5);
    border: 2px dashed #666;
  }
`;

const SvgPanel: React.FC<SvgPanelProps> = ({ panel, pageId }) => {
  const svgPath = pointsToSvgPath(panel.points);
  const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

  return (
    <PanelContainer>
      <PanelSvg>
        <PanelPolygon d={svgPath} />
        {panel.imageUrl && (
          <clipPath id={`clip-${panel.id}`}>
            <path d={svgPath} />
          </clipPath>
        )}
      </PanelSvg>
      
      {panel.imageUrl && (
        <PanelImage 
          src={panel.imageUrl} 
          alt="Comic panel content"
          style={{
            position: 'absolute',
            top: dropZone.top,
            left: dropZone.left,
            width: dropZone.width,
            height: dropZone.height,
            clipPath: `url(#clip-${panel.id})`
          }}
        />
      )}

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
    </PanelContainer>
  );
};

export default SvgPanel; 