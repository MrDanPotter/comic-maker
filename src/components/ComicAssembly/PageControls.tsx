import React from 'react';
import styled from 'styled-components';

interface PageControlsProps {
  displayNumber: number;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRotate?: () => void;
  onMirror?: () => void;
  isFirstPage?: boolean;
  isLastPage?: boolean;
}

const Container = styled.div`
  position: absolute;
  top: -12px;
  right: -24px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 4px 12px;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: all 0.2s ease;
  z-index: 3;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const PageNumber = styled.div`
  color: #666;
  font-weight: 500;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
  width: 16px;
  height: 16px;
  border-radius: 50%;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: none;
    }
  }
`;

const DeleteButton = styled(IconButton)`
  color: #dc3545;
  
  &:hover {
    background: rgba(220, 53, 69, 0.1);
  }

  &:active {
    background: rgba(220, 53, 69, 0.2);
  }
`;

const ArrowButton = styled(IconButton)`
  color: #666;
`;

const RotateButton = styled(IconButton)`
  color: #2196f3;
  
  &:hover {
    background: rgba(33, 150, 243, 0.1);
  }

  &:active {
    background: rgba(33, 150, 243, 0.2);
  }
`;

const MirrorButton = styled(IconButton)`
  color: #9c27b0;
  
  &:hover {
    background: rgba(156, 39, 176, 0.1);
  }

  &:active {
    background: rgba(156, 39, 176, 0.2);
  }
`;

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
  </svg>
);

const MirrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M8.5 2.687a.5.5 0 1 1-.998-.062v.062a.5.5 0 0 1 .998 0zm-1.5 1.096V4h-.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.5v-.217l6.25-3.625a.5.5 0 0 0 0-.866l-6.25-3.625a.5.5 0 0 0-.5 0l-6.25 3.625a.5.5 0 0 0 0 .866L7 3.783z"/>
  </svg>
);

const PageControls: React.FC<PageControlsProps> = ({ 
  displayNumber, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  onRotate,
  onMirror,
  isFirstPage = false, 
  isLastPage = false 
}) => {
  return (
    <Container>
      {!isFirstPage && onMoveUp && (
        <ArrowButton onClick={onMoveUp} title="Move page up">
          <ArrowUpIcon />
        </ArrowButton>
      )}
      <PageNumber>Page {displayNumber}</PageNumber>
      {!isLastPage && onMoveDown && (
        <ArrowButton onClick={onMoveDown} title="Move page down">
          <ArrowDownIcon />
        </ArrowButton>
      )}
      {onRotate && (
        <RotateButton onClick={onRotate} title="Rotate page">
          <RotateIcon />
        </RotateButton>
      )}
      {onMirror && (
        <MirrorButton onClick={onMirror} title="Mirror page">
          <MirrorIcon />
        </MirrorButton>
      )}
      <DeleteButton onClick={onDelete} title="Delete page">
        <TrashIcon />
      </DeleteButton>
    </Container>
  );
};

export default PageControls; 