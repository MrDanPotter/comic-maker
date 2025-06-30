import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectSystemContext, selectUseOpenAIImageGeneration, setSystemContext, selectReferenceImages } from '../../store/slices/appStateSlice';
import { createImageGeneratorService, ImageQuality, ReferenceImage } from '../../services/imageGeneratorService';
import { AspectRatio } from '../../types/comic';
import SystemContextModal from '../Header/SystemContextModal';
import ReferenceImageSelectorModal from './ReferenceImageSelectorModal';
import ReferenceImageCard from './ReferenceImageCard';
import Modal from '../Modal';
import Image from '../Image';

interface AiImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string, prompt?: string, referenceImages?: ReferenceImage[]) => void;
  aspectRatio: AspectRatio;
  apiKey: string;
  imageUrl?: string; // Optional existing image to display
  existingPrompt?: string; // Optional existing prompt to pre-populate
  existingReferenceImages?: ReferenceImage[]; // Optional existing reference images to pre-populate
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
  gap: 8px;
  margin-bottom: 8px;
`;

const QualityOption = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  padding: 12px;
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isSelected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: ${props => props.$isSelected ? '#667eea' : '#ccc'};
    transform: translateY(-1px);
  }
`;

const QualityOptionTitle = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const CostInfo = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #666;
  text-align: center;
`;

const AspectRatioPickerContainer = styled.div`
  margin-bottom: 24px;
`;

const AspectRatioPickerLabel = styled.label`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
`;

const AspectRatioPickerGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const AspectRatioOption = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  padding: 8px;
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isSelected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: ${props => props.$isSelected ? '#667eea' : '#ccc'};
    transform: translateY(-1px);
  }
`;

const AspectRatioOptionIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const SquareIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #333;
  background: #f0f0f0;
  margin: 0 auto 4px;
`;

const LandscapeIcon = styled.div`
  width: 32px;
  height: 20px;
  border: 2px solid #333;
  background: #f0f0f0;
  margin: 0 auto 4px;
`;

const PortraitIcon = styled.div`
  width: 20px;
  height: 32px;
  border: 2px solid #333;
  background: #f0f0f0;
  margin: 0 auto 4px;
`;

const AspectRatioOptionTitle = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
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
  aspectRatio: initialAspectRatio, 
  apiKey, 
  imageUrl, 
  existingPrompt, 
  existingReferenceImages 
}) => {
  const dispatch = useAppDispatch();
  const systemContext = useAppSelector(selectSystemContext);
  const useOpenAIImageGeneration = useAppSelector(selectUseOpenAIImageGeneration);
  const referenceImages = useAppSelector(selectReferenceImages);
  
  const [promptText, setPromptText] = useState(existingPrompt || '');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialAspectRatio);
  const [quality, setQuality] = useState<ImageQuality>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(imageUrl || '');
  const [error, setError] = useState('');
  const [showSystemContextModal, setShowSystemContextModal] = useState(false);
  const [showReferenceImageSelector, setShowReferenceImageSelector] = useState(false);
  const [selectedReferenceImages, setSelectedReferenceImages] = useState<ReferenceImage[]>(existingReferenceImages || []);

  // Cost calculation based on quality
  const getCostForQuality = (quality: ImageQuality): number => {
    switch (quality) {
      case 'low': return 0.02;
      case 'medium': return 0.05;
      case 'high': return 0.20;
      default: return 0.05;
    }
  };

  const currentCost = getCostForQuality(quality);

  // Update generatedImageUrl when imageUrl prop changes
  useEffect(() => {
    setGeneratedImageUrl(imageUrl || '');
  }, [imageUrl]);

  // Update promptText when existingPrompt prop changes
  useEffect(() => {
    setPromptText(existingPrompt || '');
  }, [existingPrompt]);

  // Update selectedReferenceImages when existingReferenceImages prop changes
  useEffect(() => {
    setSelectedReferenceImages(existingReferenceImages || []);
  }, [existingReferenceImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');

    try {
      // Create the appropriate service and generate image
      const imageService = createImageGeneratorService(useOpenAIImageGeneration);
      const response = await imageService.generateImage(
        promptText.trim(), 
        apiKey, 
        aspectRatio,
        quality,
        selectedReferenceImages,
        systemContext
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
      onImageGenerated(generatedImageUrl, promptText.trim(), selectedReferenceImages);
      handleClose();
    }
  };

  const handleClose = () => {
    setPromptText('');
    setAspectRatio(initialAspectRatio);
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
            {!systemContext.trim() && referenceImages.length === 0 && (
              <AlertContainer>
                <AlertText>
                  Note: neither system context nor reference images have been set. These are not required but help create more consistent art styles in your generated images.
                </AlertText>
                <SetContextButton onClick={() => setShowSystemContextModal(true)}>
                  Set them now
                </SetContextButton>
              </AlertContainer>
            )}
            
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
                <QualityPickerLabel>Compute Resources</QualityPickerLabel>
                <QualityPickerGroup>
                  <QualityOption 
                    $isSelected={quality === 'low'}
                    onClick={() => !isGenerating && setQuality('low')}
                  >
                    <QualityOptionTitle>Low</QualityOptionTitle>
                  </QualityOption>
                  <QualityOption 
                    $isSelected={quality === 'medium'}
                    onClick={() => !isGenerating && setQuality('medium')}
                  >
                    <QualityOptionTitle>Medium</QualityOptionTitle>
                  </QualityOption>
                  <QualityOption 
                    $isSelected={quality === 'high'}
                    onClick={() => !isGenerating && setQuality('high')}
                  >
                    <QualityOptionTitle>High</QualityOptionTitle>
                  </QualityOption>
                </QualityPickerGroup>
                <CostInfo>
                  Generation will cost an estimated ${currentCost.toFixed(2)}
                </CostInfo>
              </QualityPickerContainer>
              
              <AspectRatioPickerContainer>
                <AspectRatioPickerLabel>Image Aspect Ratio</AspectRatioPickerLabel>
                <AspectRatioPickerGroup>
                  <AspectRatioOption 
                    $isSelected={aspectRatio === 'square'}
                    onClick={() => !isGenerating && setAspectRatio('square')}
                  >
                    <AspectRatioOptionIcon>
                      <SquareIcon />
                    </AspectRatioOptionIcon>
                    <AspectRatioOptionTitle>Square</AspectRatioOptionTitle>
                  </AspectRatioOption>
                  <AspectRatioOption 
                    $isSelected={aspectRatio === 'landscape'}
                    onClick={() => !isGenerating && setAspectRatio('landscape')}
                  >
                    <AspectRatioOptionIcon>
                      <LandscapeIcon />
                    </AspectRatioOptionIcon>
                    <AspectRatioOptionTitle>Landscape</AspectRatioOptionTitle>
                  </AspectRatioOption>
                  <AspectRatioOption 
                    $isSelected={aspectRatio === 'portrait'}
                    onClick={() => !isGenerating && setAspectRatio('portrait')}
                  >
                    <AspectRatioOptionIcon>
                      <PortraitIcon />
                    </AspectRatioOptionIcon>
                    <AspectRatioOptionTitle>Portrait</AspectRatioOptionTitle>
                  </AspectRatioOption>
                </AspectRatioPickerGroup>
              </AspectRatioPickerContainer>
              
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
                  onClick={handleSubmit}
                >
                  {isGenerating && <LoadingSpinner />}
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </ButtonContainer>
            
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
                      expandOnClick={true}
                      title="Click to view full resolution"
                    />
                  </PreviewImage>
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
        onOpenContextModal={() => setShowSystemContextModal(true)}
      />
    </>
  );
};

export default AiImageModal; 