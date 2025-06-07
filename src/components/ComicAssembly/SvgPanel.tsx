import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { Panel, BoundingBox } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import PanelImage from './PanelImage';

interface SvgPanelProps {
  panels: Panel[];
  pageId: string;
}

const PanelContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const EmptyPanelPolygon = styled.path`
  stroke: #333;
  stroke-width: 2px;
  fill: #f5f5f5;
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

const SvgPanel: React.FC<SvgPanelProps> = ({ panels, pageId }) => {
  return (
    <PanelContainer>
      {panels.map(panel => {
        const svgPath = pointsToSvgPath(panel.points);
        const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

        return panel.imageUrl ? (
          <PanelImage
            key={panel.id}
            src={panel.imageUrl}
            panelId={panel.id}
            pageId={pageId}
            width={dropZone.width}
            height={dropZone.height}
            points={panel.points}
            dropZone={dropZone}
          />
        ) : (
          <React.Fragment key={panel.id}>
            <EmptyPanelPolygon d={svgPath} />
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
          </React.Fragment>
        );
      })}
    </PanelContainer>
  );
};

export default SvgPanel;
