import React from 'react';
import styled from 'styled-components';
import { Trash2, ChevronUp, ChevronDown, RotateCcw, Repeat } from 'react-feather';

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
  width: 20px;
  height: 20px;
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

  svg {
    width: 15px;
    height: 15px;
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
  <Trash2 size={15} />
);

const ArrowUpIcon = () => (
  <ChevronUp size={15} />
);

const ArrowDownIcon = () => (
  <ChevronDown size={15} />
);

const RotateIcon = () => (
  <RotateCcw size={15} />
);

const MirrorIcon = () => (
  <Repeat size={15} />
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