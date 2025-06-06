import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import PanelImage from './PanelImage';

interface ComicPageProps {
  pageId: string;
  displayNumber: number;
  layout: Array<{
    id: string;
    width: string;
    height: string;
    imageUrl?: string;
  }>;
  onDelete: () => void;
}

const PageContainer = styled.div`
  width: 800px;
  height: 1000px;
  background: white;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-content: flex-start;
  position: relative;
`;

const PageControls = styled.div`
  position: absolute;
  top: -15px;
  right: -15px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
`;

const PageNumber = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #ffebee;
    color: #d32f2f;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Panel = styled.div<{ width: string; height: string }>`
  border: 2px solid #333;
  background: #f5f5f5;
  width: ${props => props.width};
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
`;

const DroppablePanel = styled(Panel)`
  &.dragging-over {
    background: #e0e0e0;
    border: 2px dashed #666;
  }
`;

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>
);

const ComicPage: React.FC<ComicPageProps> = ({ pageId, displayNumber, layout, onDelete }) => {
  return (
    <PageContainer>
      <PageControls>
        <PageNumber>Page {displayNumber}</PageNumber>
        <DeleteButton onClick={onDelete} title="Delete page">
          <TrashIcon />
        </DeleteButton>
      </PageControls>
      {layout.map((panel) => (
        <Droppable key={panel.id} droppableId={`${pageId}-${panel.id}`} type="IMAGE_LIBRARY">
          {(provided, snapshot) => (
            <DroppablePanel
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={snapshot.isDraggingOver ? 'dragging-over' : ''}
              width={panel.width}
              height={panel.height}
            >
              {panel.imageUrl && (
                <PanelImage src={panel.imageUrl} alt="Comic panel content" />
              )}
              {provided.placeholder}
            </DroppablePanel>
          )}
        </Droppable>
      ))}
    </PageContainer>
  );
};

export default ComicPage; 