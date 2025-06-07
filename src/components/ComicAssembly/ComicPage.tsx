import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import SvgPanel from './SvgPanel';
import DragDropLayer from './DragDropLayer';

interface ComicPageProps {
  pageId: string;
  displayNumber: number;
  panels: Panel[];
  onDelete: () => void;
}

const PageContainer = styled.div`
  position: relative;
  width: 800px;
  height: 1000px;
  margin: 0 auto 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const PageControls = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

const PageNumber = styled.div`
  color: #666;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const ComicPage: React.FC<ComicPageProps> = ({ pageId, displayNumber, panels, onDelete }) => {
  return (
    <PageContainer>
      <PageControls>
        <PageNumber>Page {displayNumber}</PageNumber>
        <DeleteButton onClick={onDelete} title="Delete page">
          <TrashIcon />
        </DeleteButton>
      </PageControls>
      <SvgPanel panels={panels} pageId={pageId} />
      <DragDropLayer panels={panels} pageId={pageId} />
    </PageContainer>
  );
};

export default ComicPage; 