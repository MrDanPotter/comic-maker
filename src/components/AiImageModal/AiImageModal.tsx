import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectSystemContext, selectUseOpenAIImageGeneration, setSystemContext, ReferenceImage } from '../../store/slices/appStateSlice';
import { createImageGeneratorService, ImageQuality } from '../../services/imageGeneratorService';
import { buildImagePrompt } from '../../utils/promptBuilder';
import SystemContextModal from '../Header/SystemContextModal';
import ReferenceImageSelectorModal from './ReferenceImageSelectorModal';
import ReferenceImageCard from './ReferenceImageCard';
import Modal from '../Modal';
import Image from '../Image';

interface AiImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string, prompt?: string) => void;
  aspectRatio: string;
  apiKey: string;
  imageUrl?: string; // Optional existing image to display
  existingPrompt?: string; // Optional existing prompt to pre-populate
}

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

const PreviewImage = styled.div`
  width: 300px;
  height: 300px;
  margin: 0 auto;
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

const QualityPickerContainer = styled.div`
  margin-bottom: 24px;
`;

const QualityPickerLabel = styled.label`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
`;

const QualityPickerGroup = styled.div`
  display: flex;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
`;

const QualityOption = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-right: 1px solid #e0e0e0;
  background: ${props => props.$isSelected ? '#667eea' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : '#555'};
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background: ${props => props.$isSelected ? '#5a6fd8' : '#e9ecef'};
  }
`;

const QualityOptionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const QualityOptionCost = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const CostInfo = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background: #e8f4fd;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #0c5460;
  text-align: center;
`;

const ModalContent = styled.div`
  display: flex;
  max-height: 80vh;
  overflow: hidden;
`;

const AddImageContextButton = styled.button`
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
  margin-bottom: 24px;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SelectedImagesContainer = styled.div`
  margin-bottom: 24px;
`;

const SelectedImagesTitle = styled.h4`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin: 0 0 12px 0;
`;

const SelectedImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const AiImageModal: React.FC<AiImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onImageGenerated, 
  aspectRatio, 
  apiKey, 
  imageUrl, 
  existingPrompt 
}) => {
  const dispatch = useAppDispatch();
  const systemContext = useAppSelector(selectSystemContext);
  const useOpenAIImageGeneration = useAppSelector(selectUseOpenAIImageGeneration);
  const [promptText, setPromptText] = useState(existingPrompt || '');
  const [enforceAspectRatio, setEnforceAspectRatio] = useState(true);
  const [includeSystemContext, setIncludeSystemContext] = useState(true);
  const [quality, setQuality] = useState<ImageQuality>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(imageUrl || '');
  const [error, setError] = useState('');
  const [showSystemContextModal, setShowSystemContextModal] = useState(false);
  const [showReferenceImageSelector, setShowReferenceImageSelector] = useState(false);
  const [selectedReferenceImages, setSelectedReferenceImages] = useState<ReferenceImage[]>([]);

  // Cost calculation based on quality
  const getCostForQuality = (quality: ImageQuality): number => {
    switch (quality) {
      case 'low': return 0.01;
      case 'medium': return 0.05;
      case 'high': return 0.10;
      default: return 0.05;
    }
  };

  const currentCost = getCostForQuality(quality);

  // Update generatedImageUrl when imageUrl prop changes
  React.useEffect(() => {
    setGeneratedImageUrl(imageUrl || '');
  }, [imageUrl]);

  // Update promptText when existingPrompt prop changes
  React.useEffect(() => {
    setPromptText(existingPrompt || '');
  }, [existingPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');

    try {
      // Build the full prompt
      const fullPrompt = buildImagePrompt({
        userPrompt: promptText.trim(),
        systemContext,
        includeSystemContext,
        enforceAspectRatio,
        aspectRatio: enforceAspectRatio ? aspectRatio : '1:1'
      });

      // Create the appropriate service and generate image
      const imageService = createImageGeneratorService(useOpenAIImageGeneration);
      const response = await imageService.generateImage(
        fullPrompt, 
        apiKey, 
        enforceAspectRatio ? aspectRatio : '1:1',
        quality
      );
      
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
      onImageGenerated(generatedImageUrl, promptText.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setPromptText('');
    setEnforceAspectRatio(true);
    setIncludeSystemContext(true);
    setQuality('medium');
    setIsGenerating(false);
    setGeneratedImageUrl('');
    setError('');
    setSelectedReferenceImages([]);
    onClose();
  };

  const handleSetSystemContext = (context: string, useOpenAI: boolean) => {
    dispatch(setSystemContext(context));
  };

  const handleReferenceImagesSelected = (images: ReferenceImage[]) => {
    setSelectedReferenceImages(images);
  };

  const handleRemoveReferenceImage = (imageId: string) => {
    setSelectedReferenceImages(selectedReferenceImages.filter(img => img.id !== imageId));
  };

  const isImageReferencedInPrompt = (image: ReferenceImage): boolean => {
    if (!image.customName) return true; // If no custom name, consider it referenced
    const promptLower = promptText.toLowerCase();
    const nameLower = image.customName.toLowerCase();
    return promptLower.includes(nameLower);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="1000px" minWidth="800px" padding="0">
        <ModalContent>
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
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="A detailed description of the image you want to generate..."
                  disabled={isGenerating}
                />
              </FormGroup>
              
              <QualityPickerContainer>
                <QualityPickerLabel>Image Quality</QualityPickerLabel>
                <QualityPickerGroup>
                  <QualityOption 
                    $isSelected={quality === 'low'}
                    onClick={() => !isGenerating && setQuality('low')}
                  >
                    <QualityOptionTitle>Low</QualityOptionTitle>
                    <QualityOptionCost>Fast</QualityOptionCost>
                  </QualityOption>
                  <QualityOption 
                    $isSelected={quality === 'medium'}
                    onClick={() => !isGenerating && setQuality('medium')}
                  >
                    <QualityOptionTitle>Medium</QualityOptionTitle>
                    <QualityOptionCost>Balanced</QualityOptionCost>
                  </QualityOption>
                  <QualityOption 
                    $isSelected={quality === 'high'}
                    onClick={() => !isGenerating && setQuality('high')}
                  >
                    <QualityOptionTitle>High</QualityOptionTitle>
                    <QualityOptionCost>Best</QualityOptionCost>
                  </QualityOption>
                </QualityPickerGroup>
                <CostInfo>
                  Generation will cost an estimated ${currentCost.toFixed(2)}
                </CostInfo>
              </QualityPickerContainer>
              
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
              
              {/* Add Image Context Button - moved below system context checkbox */}
              <AddImageContextButton onClick={() => setShowReferenceImageSelector(true)}>
                Add Image Context
              </AddImageContextButton>
              
              {/* Selected Reference Images */}
              {selectedReferenceImages.length > 0 && (
                <SelectedImagesContainer>
                  <SelectedImagesTitle>Selected Reference Images:</SelectedImagesTitle>
                  <SelectedImageGrid>
                    {selectedReferenceImages.map((image) => (
                      <ReferenceImageCard
                        key={image.id}
                        image={image}
                        isReferenced={isImageReferencedInPrompt(image)}
                        showStatusIndicator={true}
                        onRemove={() => handleRemoveReferenceImage(image.id)}
                        size="small"
                      />
                    ))}
                  </SelectedImageGrid>
                </SelectedImagesContainer>
              )}
              
              <ButtonContainer>
                <Button type="button" onClick={handleClose} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  $isPrimary 
                  $isDisabled={!promptText.trim() || isGenerating}
                  $isLoading={isGenerating}
                  disabled={!promptText.trim() || isGenerating}
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
                  <PreviewImage>
                    <Image 
                      src={generatedImageUrl} 
                      alt="Generated preview" 
                      width="300px"
                      height="300px"
                      borderRadius="8px"
                      expandable={true}
                      title="Click to view full resolution"
                    />
                  </PreviewImage>
                  {/* Only show "Use Image" button if this is a newly generated image, not an existing one */}
                  {!imageUrl && (
                    <ButtonContainer style={{ marginTop: '20px' }}>
                      <Button 
                        type="button" 
                        $isPrimary 
                        onClick={handleUseImage}
                      >
                        Use Image
                      </Button>
                    </ButtonContainer>
                  )}
                </>
              ) : (
                <PreviewPlaceholder>
                  Your generated image will appear here
                </PreviewPlaceholder>
              )}
            </PreviewSection>
          </RightPanel>
        </ModalContent>
      </Modal>
      
      {/* System Context Modal */}
      <SystemContextModal
        isOpen={showSystemContextModal}
        onClose={() => setShowSystemContextModal(false)}
        onSubmit={handleSetSystemContext}
        currentContext={systemContext}
        currentUseOpenAI={useOpenAIImageGeneration}
      />
      
      {/* Reference Image Selector Modal */}
      <ReferenceImageSelectorModal
        isOpen={showReferenceImageSelector}
        onClose={() => setShowReferenceImageSelector(false)}
        onImagesSelected={handleReferenceImagesSelected}
        selectedImages={selectedReferenceImages}
        promptText={promptText}
      />
    </>
  );
};

export default AiImageModal; 