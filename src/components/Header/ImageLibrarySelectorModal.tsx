import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/store';
import { selectAllImages } from '../../store/slices/imageLibrarySlice';
import { ReferenceImage } from '../../store/slices/appStateSlice';
import type { ReferenceImageType } from '../../types/comic';
import Modal from '../shared/Modal';
import ReferenceImageCard from '../shared/ReferenceImageCard/ReferenceImageCard';

interface ImageLibrarySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (referenceImage: ReferenceImage) => void;
  imageType: ReferenceImageType;
}

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
`;



const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-family: 'Roboto', sans-serif;
`;

const ImageLibrarySelectorModal: React.FC<ImageLibrarySelectorModalProps> = ({
  isOpen,
  onClose,
  onImageSelected,
  imageType
}) => {
  const images = useAppSelector(selectAllImages);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImageSelect = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleConfirm = () => {
    if (selectedImageId) {
      const selectedImage = images.find(img => img.id === selectedImageId);
      if (selectedImage) {
        const referenceImage: ReferenceImage = {
          id: selectedImage.id,
          url: selectedImage.url,
          type: imageType,
          name: selectedImage.url.split('/').pop() || 'image.jpg'
        };
        onImageSelected(referenceImage);
        onClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedImageId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Select ${imageType} from Image Library`} maxWidth="600px">
      {images.length === 0 ? (
        <EmptyState>
          <p>No images in your library yet.</p>
          <p>Upload some images first to use them as references.</p>
        </EmptyState>
      ) : (
        <>
          <ImageGrid>
            {images.map((image) => (
              <ReferenceImageCard
                key={image.id}
                url={image.url}
                alt={image.url.split('/').pop() || 'image'}
                customName={image.source === 'ai' && image.prompt ? image.prompt : undefined}
                isSelected={selectedImageId === image.id}
                onClick={() => handleImageSelect(image.id)}
                showStatusIndicator={false}
              />
            ))}
          </ImageGrid>
          
          <ButtonContainer>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              $isPrimary 
              onClick={handleConfirm}
              disabled={!selectedImageId}
            >
              Select Image
            </Button>
          </ButtonContainer>
        </>
      )}
    </Modal>
  );
};

export default ImageLibrarySelectorModal; 