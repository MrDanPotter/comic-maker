import React, { useState } from 'react';
import styled from 'styled-components';

interface AiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
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
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 1.8rem;
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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
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

const InstructionText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
  margin: 16px 0 0 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled.button<{ $isPrimary?: boolean; $isDisabled?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  ${props => props.$isPrimary ? `
    background: ${props.$isDisabled ? '#ccc' : '#667eea'};
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;
    
    &:hover:not(:disabled) {
      background: #e9ecef;
    }
  `}
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const AiKeyModal: React.FC<AiKeyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
      setApiKey('');
    }
  };

  const handleClose = () => {
    setApiKey('');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Bring Your Own Key</ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="openai-key">OpenAI Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
          </FormGroup>
          
          <InstructionText>
            To use AI features with this application, you'll need to provide your own OpenAI API key. 
            You can get one by signing up at <strong>platform.openai.com</strong>. 
            Once you have your key, paste it in the field above and click Submit. 
            Your key will be stored locally and used only for AI operations within this app.
          </InstructionText>
          
          <ButtonContainer>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              $isPrimary 
              $isDisabled={!apiKey.trim()}
              disabled={!apiKey.trim()}
            >
              Submit
            </Button>
          </ButtonContainer>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AiKeyModal; 