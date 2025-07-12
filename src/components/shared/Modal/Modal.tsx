import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  minWidth?: string;
  padding?: string;
  closeOnOverlayClick?: boolean;
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
  
  &.ModalOverlay {
    /* This class is used for print styles */
  }
`;

const ModalContainer = styled.div<{ $maxWidth?: string; $minWidth?: string; $padding?: string }>`
  background: white;
  border-radius: 12px;
  max-width: ${props => props.$maxWidth || '700px'};
  min-width: ${props => props.$minWidth || '400px'};
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  position: relative;
  padding: ${props => props.$padding || '32px'};

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

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  text-align: left;
  letter-spacing: 1px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0 8px;
  margin-left: 16px;
  transition: color 0.2s;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  &:hover {
    color: #d32f2f;
  }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth, minWidth, padding, closeOnOverlayClick = true }) => {
  // Prevent click inside modal from closing
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick} className="ModalOverlay">
      <ModalContainer $maxWidth={maxWidth} $minWidth={minWidth} $padding={padding} onClick={handleContainerClick}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton aria-label="Close modal" onClick={onClose}>
              &times;
            </CloseButton>
          </ModalHeader>
        )}
        {!title && (
          <CloseButton aria-label="Close modal" onClick={onClose}>
            &times;
          </CloseButton>
        )}
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal; 