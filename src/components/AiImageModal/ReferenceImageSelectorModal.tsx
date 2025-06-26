import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/store';
import { selectReferenceImages, ReferenceImage } from '../../store/slices/appStateSlice';
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

const ReferenceImageSelectorModal: React.FC<ReferenceImageSelectorModalProps> = ({
  isOpen,
  onClose,
  onImagesSelected,
  selectedImages,
  promptText
}) => {
  const referenceImages = useAppSelector(selectReferenceImages);
  const [localSelectedImages, setLocalSelectedImages] = React.useState<ReferenceImage[]>(selectedImages);

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

  const handleConfirm = () => {
    onImagesSelected(localSelectedImages);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedImages(selectedImages);
    onClose();
  };

  const isImageReferencedInPrompt = (image: ReferenceImage): boolean => {
    if (!image.customName) return true; // If no custom name, consider it referenced
    const promptLower = promptText.toLowerCase();
    const nameLower = image.customName.toLowerCase();
    return promptLower.includes(nameLower);
  };

  if (referenceImages.length === 0) {
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
                size="medium"
                showStatusIndicator={false}
              />
            );
          })}
        </ReferenceImageGrid>
        
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