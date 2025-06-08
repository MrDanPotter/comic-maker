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
}

const PageContainer = styled.div`
  position: relative;
  width: 800px;
  height: 1000px;
  margin: 0 auto 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
`;

const ComicPage: React.FC<ComicPageProps> = ({ pageId, displayNumber, panels, onDelete }) => {
  return (
    <PageContainer>
      <PageControls displayNumber={displayNumber} onDelete={onDelete} />
      <SvgPanel panels={panels} pageId={pageId} />
      <DragDropLayer panels={panels} pageId={pageId} />
    </PageContainer>
  );
};

export default ComicPage; 