import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/store';
import { selectReferenceImages, ReferenceImage } from '../../store/slices/appStateSlice';
import { selectAllImages } from '../../store/slices/imageLibrarySlice';
import { Image } from '../../types/comic';
import type { ReferenceImageType } from '../../types/comic';
import Modal from '../Modal';
import ReferenceImageCard from './ReferenceImageCard';

interface ReferenceImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesSelected: (selectedImages: ReferenceImage[]) => void;
  selectedImages: ReferenceImage[];
  promptText: string;
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

const SectionDivider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 32px 0;
`;

const ReferenceImageSelectorModal: React.FC<ReferenceImageSelectorModalProps> = ({
  isOpen,
  onClose,
  onImagesSelected,
  selectedImages,
  promptText
}) => {
  const referenceImages = useAppSelector(selectReferenceImages);
  const imageLibraryImages = useAppSelector(selectAllImages);
  const [localSelectedImages, setLocalSelectedImages] = React.useState<ReferenceImage[]>(selectedImages);
  const [localSelectedLibraryImages, setLocalSelectedLibraryImages] = React.useState<Image[]>([]);

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
    // Convert selected library images to reference images format
    const libraryImagesAsReferences: ReferenceImage[] = localSelectedLibraryImages.map(img => ({
      id: img.id,
      url: img.url,
      type: 'scene' as ReferenceImageType, // Default to scene type for library images
      name: `Library Image ${img.id}`,
      customName: img.source === 'ai' && img.prompt ? img.prompt : undefined
    }));
    
    // Combine both types of selected images
    const allSelectedImages = [...localSelectedImages, ...libraryImagesAsReferences];
    onImagesSelected(allSelectedImages);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedImages(selectedImages);
    setLocalSelectedLibraryImages([]);
    onClose();
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
          <EmptyStateTitle>No Reference Images Available</EmptyStateTitle>
          <EmptyStateText>
            You haven't added any reference images yet. Add style, character, or scene references 
            in the System Context settings to use them here.
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
                
                return (
                  <ReferenceImageCard
                    key={image.id}
                    image={image}
                    isSelected={isSelected}
                    isReferenced={isReferenced}
                    onClick={() => handleImageToggle(image)}
                    showStatusIndicator={false}
                  />
                );
              })}
            </ReferenceImageGrid>
          </>
        )}

        {referenceImages.length > 0 && imageLibraryImages.length > 0 && (
          <SectionDivider />
        )}

        {imageLibraryImages.length > 0 && (
          <>
            <SectionTitle>Image Library</SectionTitle>
            <ReferenceImageGrid>
              {imageLibraryImages.map((image) => {
                const isSelected = localSelectedLibraryImages.some(img => img.id === image.id);
                const isReferenced = isLibraryImageReferencedInPrompt(image);
                
                return (
                  <ReferenceImageCard
                    key={image.id}
                    image={image}
                    isSelected={isSelected}
                    isReferenced={isReferenced}
                    onClick={() => handleLibraryImageToggle(image)}
                    showStatusIndicator={false}
                  />
                );
              })}
            </ReferenceImageGrid>
          </>
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