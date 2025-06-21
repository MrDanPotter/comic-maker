import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectSystemContext, selectUseOpenAIImageGeneration, setSystemContext } from '../../store/slices/appStateSlice';
import { createImageGeneratorService } from '../../services/imageGeneratorService';
import { buildImagePrompt } from '../../utils/promptBuilder';
import SystemContextModal from '../Header/SystemContextModal';

interface AiImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
  aspectRatio: string;
  apiKey: string;
  imageUrl?: string; // Optional existing image to display
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
  max-width: 1000px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  
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

const LeftPanel = styled.div`
  flex: 1;
  padding: 32px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  min-width: 400px;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 32px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 400px;
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
  min-height: 120px;
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
  width: 100%;
  text-align: center;
`;

const PreviewTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 20px 0;
`;

const PreviewImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 0 auto;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PreviewPlaceholder = styled.div`
  width: 300px;
  height: 300px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  background: #f8f9fa;
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

// Full resolution image overlay
const FullResOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: ${props => props.$isOpen ? 'fadeIn' : 'fadeOut'} 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const FullResImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
  
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
`;

const AlertContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const AlertText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #856404;
  margin: 0;
  line-height: 1.4;
`;

const SetContextButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AiImageModal: React.FC<AiImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onImageGenerated, 
  aspectRatio, 
  apiKey, 
  imageUrl 
}) => {
  const dispatch = useAppDispatch();
  const systemContext = useAppSelector(selectSystemContext);
  const useOpenAIImageGeneration = useAppSelector(selectUseOpenAIImageGeneration);
  const [prompt, setPrompt] = useState('');
  const [enforceAspectRatio, setEnforceAspectRatio] = useState(true);
  const [includeSystemContext, setIncludeSystemContext] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(imageUrl || '');
  const [error, setError] = useState('');
  const [showFullRes, setShowFullRes] = useState(false);
  const [showSystemContextModal, setShowSystemContextModal] = useState(false);

  // Update generatedImageUrl when imageUrl prop changes
  React.useEffect(() => {
    setGeneratedImageUrl(imageUrl || '');
  }, [imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');

    try {
      // Build the full prompt
      const fullPrompt = buildImagePrompt({
        userPrompt: prompt.trim(),
        systemContext,
        includeSystemContext,
        enforceAspectRatio,
        aspectRatio: enforceAspectRatio ? aspectRatio : '1:1'
      });

      // Create the appropriate service and generate image
      const imageService = createImageGeneratorService(useOpenAIImageGeneration);
      const response = await imageService.generateImage(fullPrompt, apiKey);
      
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
    setIncludeSystemContext(true);
    setIsGenerating(false);
    setGeneratedImageUrl('');
    setError('');
    setShowFullRes(false);
    onClose();
  };

  const handleImageClick = () => {
    if (generatedImageUrl) {
      setShowFullRes(true);
    }
  };

  const handleFullResClose = () => {
    setShowFullRes(false);
  };

  const handleSetSystemContext = (context: string, useOpenAI: boolean) => {
    dispatch(setSystemContext(context));
  };

  return (
    <>
      <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <LeftPanel>
            <ModalHeader>AI Image Generation</ModalHeader>
            
            {/* System Context Alert */}
            {!systemContext.trim() && (
              <AlertContainer>
                <AlertText>
                  Note: system context has not yet been set. System context is not required but allows you to create a more consistent art style in your images.
                </AlertText>
                <SetContextButton onClick={() => setShowSystemContextModal(true)}>
                  Set it now
                </SetContextButton>
              </AlertContainer>
            )}
            
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
              
              {systemContext.trim() && (
                <CheckboxContainer>
                  <Checkbox
                    id="include-system-context"
                    type="checkbox"
                    checked={includeSystemContext}
                    onChange={(e) => setIncludeSystemContext(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <CheckboxLabel htmlFor="include-system-context">
                    Include system context
                  </CheckboxLabel>
                </CheckboxContainer>
              )}
              
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
          </LeftPanel>
          
          <RightPanel>
            <PreviewSection>
              <PreviewTitle>
                {isGenerating ? 'Generating Image...' : 
                 generatedImageUrl ? 'Image' : 'Image Preview'}
              </PreviewTitle>
              
              {isGenerating ? (
                <div style={{ textAlign: 'center' }}>
                  <LoadingSpinner style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid #e0e0e0',
                    borderTop: '3px solid #667eea',
                    margin: '0 auto 20px'
                  }} />
                  <p style={{ color: '#666', margin: 0 }}>Creating your image...</p>
                </div>
              ) : generatedImageUrl ? (
                <>
                  <PreviewImage 
                    src={generatedImageUrl} 
                    alt="Generated preview" 
                    onClick={handleImageClick}
                    title="Click to view full resolution"
                  />
                  <ButtonContainer style={{ marginTop: '20px' }}>
                    <Button 
                      type="button" 
                      $isPrimary 
                      onClick={handleUseImage}
                    >
                      Use Image
                    </Button>
                  </ButtonContainer>
                </>
              ) : (
                <PreviewPlaceholder>
                  Your generated image will appear here
                </PreviewPlaceholder>
              )}
            </PreviewSection>
          </RightPanel>
        </ModalContainer>
      </ModalOverlay>
      
      {/* Full resolution image overlay */}
      <FullResOverlay $isOpen={showFullRes} onClick={handleFullResClose}>
        <FullResImage 
          src={generatedImageUrl} 
          alt="Full resolution preview" 
          onClick={(e) => e.stopPropagation()}
        />
      </FullResOverlay>
      
      {/* System Context Modal */}
      <SystemContextModal
        isOpen={showSystemContextModal}
        onClose={() => setShowSystemContextModal(false)}
        onSubmit={handleSetSystemContext}
        currentContext={systemContext}
        currentUseOpenAI={useOpenAIImageGeneration}
      />
    </>
  );
};

export default AiImageModal; 