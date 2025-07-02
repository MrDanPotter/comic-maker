import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { Panel, BoundingBox } from '../../types/comic';

interface DragDropLayerProps {
  panels: Panel[];
  pageId: string;
  draggedImageUrl: string | null;
  onPanelImageUpdate: (panelId: string, imageUrl: string) => void;
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
  }
`;

const PreviewImage = styled.img<{ $isDraggingOver: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$isDraggingOver ? 0.4 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
`;

const PreviewBorder = styled.div<{ $isDraggingOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #666;
  opacity: ${props => props.$isDraggingOver ? 1 : 0};
  pointer-events: none;
`;

const DragDropLayer: React.FC<DragDropLayerProps> = ({ 
  panels, 
  pageId, 
  draggedImageUrl, 
  onPanelImageUpdate 
}) => {

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
                {draggedImageUrl && (
                  <>
                    <PreviewImage
                      src={draggedImageUrl}
                      $isDraggingOver={snapshot.isDraggingOver}
                      alt="Preview"
                    />
                    <PreviewBorder $isDraggingOver={snapshot.isDraggingOver} />
                  </>
                )}
                
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