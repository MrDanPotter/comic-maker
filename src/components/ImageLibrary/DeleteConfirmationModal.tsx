import React from 'react';
import styled from 'styled-components';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  onDownloadThenDelete: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 0 0 24px 0;
  text-align: center;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ $isPrimary?: boolean; $isDanger?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  ${props => props.$isPrimary ? `
    background: #2196f3;
    color: white;
    
    &:hover {
      background: #1976d2;
      transform: translateY(-1px);
    }
  ` : props.$isDanger ? `
    background: #f44336;
    color: white;
    
    &:hover {
      background: #d32f2f;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background: #e9ecef;
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  onDownloadThenDelete
}) => {
  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Image Not Downloaded</ModalHeader>
        <ModalMessage>
          This AI-generated image has not been downloaded yet. If you delete it, it cannot be recovered.
        </ModalMessage>
        <ButtonContainer>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button $isPrimary onClick={onDownloadThenDelete}>
            Download then Delete
          </Button>
          <Button $isDanger onClick={onConfirmDelete}>
            Yes, Delete
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DeleteConfirmationModal; 