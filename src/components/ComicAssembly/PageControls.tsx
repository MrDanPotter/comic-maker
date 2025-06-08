import React from 'react';
import styled from 'styled-components';

interface PageControlsProps {
  displayNumber: number;
  onDelete: () => void;
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

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
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
    background: rgba(220, 53, 69, 0.1);
  }

  &:active {
    background: rgba(220, 53, 69, 0.2);
  }
`;

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const PageControls: React.FC<PageControlsProps> = ({ displayNumber, onDelete }) => {
  return (
    <Container>
      <PageNumber>Page {displayNumber}</PageNumber>
      <DeleteButton onClick={onDelete} title="Delete page">
        <TrashIcon />
      </DeleteButton>
    </Container>
  );
};

export default PageControls; 