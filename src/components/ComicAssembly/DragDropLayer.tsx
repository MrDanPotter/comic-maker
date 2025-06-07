import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { Panel, BoundingBox } from '../../types/comic';

interface DragDropLayerProps {
  panels: Panel[];
  pageId: string;
}

const LayerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const DroppableOverlay = styled.div<{ $dropZone: BoundingBox }>`
  position: absolute;
  top: ${props => props.$dropZone.top}px;
  left: ${props => props.$dropZone.left}px;
  width: ${props => props.$dropZone.width}px;
  height: ${props => props.$dropZone.height}px;
  pointer-events: none;

  &.dragging-over {
    pointer-events: all;
    background: rgba(224, 224, 224, 0.5);
    border: 2px dashed #666;
  }
`;

const DragDropLayer: React.FC<DragDropLayerProps> = ({ panels, pageId }) => {
  return (
    <LayerContainer>
      {panels.map(panel => {
        const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

        return (
          <Droppable key={panel.id} droppableId={`${pageId}-${panel.id}`} type="IMAGE_LIBRARY">
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
        );
      })}
    </LayerContainer>
  );
};

export default DragDropLayer; 