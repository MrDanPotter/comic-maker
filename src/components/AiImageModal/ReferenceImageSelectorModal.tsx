import React from 'react';
import styled from 'styled-components';
import { ChevronRight, AlertTriangle } from 'react-feather';
import { useAppSelector } from '../../store/store';
import { selectReferenceImages, ReferenceImage } from '../../store/slices/appStateSlice';
import { selectAllImages } from '../../store/slices/imageLibrarySlice';
import { Image } from '../../types/comic';
import type { ReferenceImageType } from '../../types/comic';
import Modal from '../shared/Modal';
import ReferenceImageCard from '../shared/ReferenceImageCard/ReferenceImageCard';

interface ReferenceImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesSelected: (selectedImages: ReferenceImage[]) => void;
  selectedImages: ReferenceImage[];
  promptText: string;
  onOpenContextModal?: () => void;
}

const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

const ReferenceImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-family: 'Roboto', sans-serif;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  color: #333;
`;

const EmptyStateText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
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

const SectionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
`;

const WarningContainer = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const WarningHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const WarningIcon = styled(AlertTriangle)`
  color: #856404;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const WarningTitle = styled.h4`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #856404;
  margin: 0;
`;

const WarningText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #856404;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const ContextButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AccordionContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 16px;
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  background: #f8f9fa;
  border: none;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: ${props => props.$isOpen ? '8px 8px 0 0' : '8px'};
  
  &:hover {
    background: #e9ecef;
  }
`;

const AccordionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const AccordionIcon = styled.div<{ $isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${props => props.$isOpen ? '90deg' : '0deg'});
  color: #666;
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${props => props.$isOpen ? '16px' : '0 16px'};
`;

const InstructionsContainer = styled.div`
  margin-bottom: 20px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
`;

const InstructionsText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const ReferenceImageSelectorModal: React.FC<ReferenceImageSelectorModalProps> = ({
  isOpen,
  onClose,
  onImagesSelected,
  selectedImages,
  promptText,
  onOpenContextModal
}) => {
  const referenceImages = useAppSelector(selectReferenceImages);
  const imageLibraryImages = useAppSelector(selectAllImages);
  const [localSelectedImages, setLocalSelectedImages] = React.useState<ReferenceImage[]>(selectedImages);
  const [localSelectedLibraryImages, setLocalSelectedLibraryImages] = React.useState<Image[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalSelectedImages(selectedImages);
  }, [selectedImages]);

  const handleImageToggle = (image: ReferenceImage) => {
    const isSelected = localSelectedImages.some(img => img.id === image.id);
    if (isSelected) {
      setLocalSelectedImages(localSelectedImages.filter(img => img.id !== image.id));
    } else {
      setLocalSelectedImages([...localSelectedImages, image]);
    }
  };

  const handleLibraryImageToggle = (image: Image) => {
    const isSelected = localSelectedLibraryImages.some(img => img.id === image.id);
    if (isSelected) {
      setLocalSelectedLibraryImages(localSelectedLibraryImages.filter(img => img.id !== image.id));
    } else {
      setLocalSelectedLibraryImages([...localSelectedLibraryImages, image]);
    }
  };

  const handleConfirm = () => {
    // Convert selected library images to reference images format with numbered names
    const libraryImagesAsReferences: ReferenceImage[] = localSelectedLibraryImages.map((img, index) => ({
      id: img.id,
      url: img.url,
      type: 'scene' as ReferenceImageType, // Default to scene type for library images
      name: `Image ${index + 1}`,
      customName: `Image ${index + 1}`
    }));
    
    // Combine both types of selected images
    const allSelectedImages = [...localSelectedImages, ...libraryImagesAsReferences];
    onImagesSelected(allSelectedImages);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedImages(selectedImages);
    setLocalSelectedLibraryImages([]);
    setIsAccordionOpen(false);
    onClose();
  };

  const handleOpenContextModal = () => {
    if (onOpenContextModal) {
      onOpenContextModal();
    }
  };

  const isImageReferencedInPrompt = (image: ReferenceImage): boolean => {
    if (!image.customName) return true; // If no custom name, consider it referenced
    const promptLower = promptText.toLowerCase();
    const nameLower = image.customName.toLowerCase();
    return promptLower.includes(nameLower);
  };

  const isLibraryImageReferencedInPrompt = (image: Image): boolean => {
    if (image.source === 'ai' && image.prompt) {
      const promptLower = promptText.toLowerCase();
      const imagePromptLower = image.prompt.toLowerCase();
      return promptLower.includes(imagePromptLower);
    }
    return true; // If no prompt, consider it referenced
  };

  if (referenceImages.length === 0 && imageLibraryImages.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Add Image Context" maxWidth="600px">
        <EmptyState>
          <EmptyStateTitle>No Images Available</EmptyStateTitle>
          <EmptyStateText>
            You haven't added any reference images or uploaded any images to your library yet. 
            Add style, character, or scene references in the System Context settings, or upload 
            images to your library to use them here.
          </EmptyStateText>
          <ButtonContainer>
            <Button onClick={onClose}>Close</Button>
          </ButtonContainer>
        </EmptyState>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Image Context" maxWidth="800px">
      <ModalContent>
        {referenceImages.length > 0 && (
          <>
            <SectionTitle>Reference Images</SectionTitle>
            <ReferenceImageGrid>
              {referenceImages.map((image) => {
                const isSelected = localSelectedImages.some(img => img.id === image.id);
                const isReferenced = isImageReferencedInPrompt(image);
                const statusText = isReferenced ? 'Referenced' : 'Not referenced';
                const statusColor = isReferenced ? '#4caf50' : '#ff9800';
                
                return (
                  <ReferenceImageCard
                    key={image.id}
                    url={image.url}
                    alt={image.name}
                    type={`${image.type} Reference`}
                    customName={image.customName}
                    isSelected={isSelected}
                    statusText={statusText}
                    statusColor={statusColor}
                    onClick={() => handleImageToggle(image)}
                    showStatusIndicator={false}
                  />
                );
              })}
            </ReferenceImageGrid>
          </>
        )}

        {referenceImages.length === 0 && (
          <WarningContainer>
            <WarningHeader>
              <WarningIcon />
              <WarningTitle>No Reference Images Added</WarningTitle>
            </WarningHeader>
            <WarningText>
              Reference images help the AI understand your desired style, characters, or scenes. 
              They provide consistent visual context for all your generated images. Add style, 
              character, or scene references to improve your AI image generation results.
            </WarningText>
            <ContextButton onClick={handleOpenContextModal}>
              Add Reference Images
            </ContextButton>
          </WarningContainer>
        )}

        {imageLibraryImages.length > 0 && (
          <AccordionContainer>
            <AccordionHeader 
              $isOpen={isAccordionOpen}
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <AccordionTitle>Image Library</AccordionTitle>
              <AccordionIcon $isOpen={isAccordionOpen}>
                <ChevronRight />
              </AccordionIcon>
            </AccordionHeader>
            <AccordionContent $isOpen={isAccordionOpen}>
              <InstructionsContainer>
                <InstructionsText>
                  When you select library images, they will be added as "Image 1", "Image 2", etc. 
                  Reference these names in your image creation prompt. For example: "Create an image 
                  that would go between Image 1 and Image 2" or "Make Image 3 more dramatic".
                </InstructionsText>
              </InstructionsContainer>
              <ReferenceImageGrid>
                {imageLibraryImages.map((image) => {
                  const isSelected = localSelectedLibraryImages.some(img => img.id === image.id);
                  const isReferenced = isLibraryImageReferencedInPrompt(image);
                  const statusText = isReferenced ? 'Referenced' : 'Not referenced';
                  const statusColor = isReferenced ? '#4caf50' : '#ff9800';
                  
                  return (
                    <ReferenceImageCard
                      key={image.id}
                      url={image.url}
                      alt={image.url.split('/').pop() || 'image'}
                      customName={image.source === 'ai' && image.prompt ? image.prompt : undefined}
                      isSelected={isSelected}
                      statusText={statusText}
                      statusColor={statusColor}
                      onClick={() => handleLibraryImageToggle(image)}
                      showStatusIndicator={false}
                    />
                  );
                })}
              </ReferenceImageGrid>
            </AccordionContent>
          </AccordionContainer>
        )}
        
        <ButtonContainer>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button $isPrimary onClick={handleConfirm}>
            Add Selected Images
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ReferenceImageSelectorModal; 