import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface SystemContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (context: string, useOpenAI: boolean) => void;
  currentContext: string;
  currentUseOpenAI: boolean;
}

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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const CheckboxLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
`;

const SystemContextModal: React.FC<SystemContextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentContext,
  currentUseOpenAI
}) => {
  const [context, setContext] = useState(currentContext);
  const [useOpenAI, setUseOpenAI] = useState(currentUseOpenAI);

  useEffect(() => {
    setContext(currentContext);
    setUseOpenAI(currentUseOpenAI);
  }, [currentContext, currentUseOpenAI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(context, useOpenAI);
    onClose();
  };

  const handleClose = () => {
    setContext(currentContext); // Reset to original value
    setUseOpenAI(currentUseOpenAI); // Reset to original value
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit System Context" maxWidth="600px">
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
        
        <CheckboxContainer>
          <Checkbox
            id="use-openai"
            type="checkbox"
            checked={useOpenAI}
            onChange={(e) => setUseOpenAI(e.target.checked)}
          />
          <CheckboxLabel htmlFor="use-openai">
            Use OpenAI Image Generation
          </CheckboxLabel>
        </CheckboxContainer>
        
        <ButtonContainer>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" $isPrimary>
            Save Context
          </Button>
        </ButtonContainer>
      </form>
    </Modal>
  );
};

export default SystemContextModal; 