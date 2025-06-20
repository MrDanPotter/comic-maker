import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface SystemContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (context: string) => void;
  currentContext: string;
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
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
  letter-spacing: 1px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$isPrimary ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
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

const InfoText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
  text-align: center;
`;

const SystemContextModal: React.FC<SystemContextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentContext
}) => {
  const [context, setContext] = useState(currentContext);

  useEffect(() => {
    setContext(currentContext);
  }, [currentContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(context);
    onClose();
  };

  const handleClose = () => {
    setContext(currentContext); // Reset to original value
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Edit System Context</ModalHeader>
        
        <InfoText>
          Set the overall tone and art style that will be used to generate all AI images.
          This context will be included in every image generation prompt.
        </InfoText>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="system-context">System Context</Label>
            <TextArea
              id="system-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Create images in a comic book style with bold colors, dynamic poses, and dramatic lighting. Use a modern superhero aesthetic with clean lines and vibrant backgrounds."
            />
          </FormGroup>
          
          <ButtonContainer>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" $isPrimary>
              Save Context
            </Button>
          </ButtonContainer>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SystemContextModal; 