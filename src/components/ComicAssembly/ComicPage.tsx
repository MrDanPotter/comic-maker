import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import SvgPanel from './SvgPanel';
import DragDropLayer from './DragDropLayer';
import PageControls from './PageControls';

interface ComicPageProps {
  pageId: string;
  displayNumber: number;
  panels: Panel[];
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRotate?: () => void;
  onMirror?: () => void;
  onPanelsUpdate: (panels: Panel[]) => void;
  onPanelImageUpdate: (panelId: string, imageUrl: string) => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  draggedImageUrl: string | null;
}

const PageContainer = styled.div`
  position: relative;
  width: 800px;
  height: 1000px;
  margin: 0 auto 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;

  @media print {
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    break-inside: avoid;
  }
`;

const PageControlsWrapper = styled.div`
  @media print {
    display: none;
  }
`;

const ComicPage: React.FC<ComicPageProps> = ({ 
  pageId, 
  displayNumber, 
  panels, 
  onDelete,
  onMoveUp,
  onMoveDown,
  onRotate,
  onMirror,
  onPanelsUpdate,
  onPanelImageUpdate,
  isFirstPage,
  isLastPage,
  draggedImageUrl
}) => {
  return (
    <PageContainer>
      <PageControlsWrapper>
        <PageControls 
          displayNumber={displayNumber} 
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRotate={onRotate}
          onMirror={onMirror}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </PageControlsWrapper>
      <SvgPanel 
        panels={panels} 
        pageId={pageId} 
        onPanelsUpdate={onPanelsUpdate}
        onPanelImageUpdate={onPanelImageUpdate}
      />
      <DragDropLayer 
        panels={panels} 
        pageId={pageId} 
        draggedImageUrl={draggedImageUrl}
        onPanelImageUpdate={onPanelImageUpdate}
      />
    </PageContainer>
  );
};

export default ComicPage; 