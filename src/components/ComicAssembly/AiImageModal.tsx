import React, { useState } from 'react';
import styled from 'styled-components';
import { generateImage, ImageGenerationRequest } from '../../services/openaiService';

interface AiImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
  aspectRatio: string;
  apiKey: string;
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
  min-height: 100px;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
`;

const Button = styled.button<{ $isPrimary?: boolean; $isDisabled?: boolean; $isLoading?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.$isDisabled || props.$isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$isPrimary ? `
    background: ${props.$isDisabled || props.$isLoading ? '#ccc' : '#667eea'};
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

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PreviewSection = styled.div`
  margin-top: 24px;
`;

const PreviewTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 0 auto;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  margin-top: 8px;
  padding: 8px 12px;
  background: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
`;

const AiImageModal: React.FC<AiImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onImageGenerated, 
  aspectRatio, 
  apiKey 
}) => {
  const [prompt, setPrompt] = useState('');
  const [enforceAspectRatio, setEnforceAspectRatio] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');

    try {
      const request: ImageGenerationRequest = {
        prompt: prompt.trim(),
        aspectRatio: enforceAspectRatio ? aspectRatio : '1:1',
        apiKey
      };

      const response = await generateImage(request);
      
      if (response.success) {
        setGeneratedImageUrl(response.imageUrl);
      } else {
        setError(response.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImageUrl) {
      onImageGenerated(generatedImageUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setEnforceAspectRatio(true);
    setIsGenerating(false);
    setGeneratedImageUrl('');
    setError('');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>AI Image Generation</ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="image-prompt">Describe the image you want to generate</Label>
            <TextArea
              id="image-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A detailed description of the image you want to generate..."
              disabled={isGenerating}
            />
          </FormGroup>
          
          <CheckboxContainer>
            <Checkbox
              id="enforce-aspect-ratio"
              type="checkbox"
              checked={enforceAspectRatio}
              onChange={(e) => setEnforceAspectRatio(e.target.checked)}
              disabled={isGenerating}
            />
            <CheckboxLabel htmlFor="enforce-aspect-ratio">
              Enforce aspect ratio of panel ({aspectRatio})
            </CheckboxLabel>
          </CheckboxContainer>
          
          <ButtonContainer>
            <Button type="button" onClick={handleClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              $isPrimary 
              $isDisabled={!prompt.trim() || isGenerating}
              $isLoading={isGenerating}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating && <LoadingSpinner />}
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </ButtonContainer>
        </form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {generatedImageUrl && (
          <PreviewSection>
            <PreviewTitle>Preview</PreviewTitle>
            <PreviewImage src={generatedImageUrl} alt="Generated preview" />
            <ButtonContainer>
              <Button 
                type="button" 
                $isPrimary 
                onClick={handleUseImage}
              >
                Use This Image
              </Button>
            </ButtonContainer>
          </PreviewSection>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AiImageModal; 