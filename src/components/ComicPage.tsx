import React from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';

interface ComicPageProps {
  pageId: string;
  layout: Array<{
    id: string;
    width: string;
    height: string;
    imageId?: string;
  }>;
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

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ComicPage: React.FC<ComicPageProps> = ({ pageId, layout }) => {
  return (
    <PageContainer>
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
              {panel.imageId && (
                <Image src={panel.imageId} alt="Comic panel content" />
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