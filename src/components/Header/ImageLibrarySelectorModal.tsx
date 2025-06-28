import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/store';
import { selectAllImages } from '../../store/slices/imageLibrarySlice';
import { ReferenceImage } from '../../store/slices/appStateSlice';
import Modal from '../Modal';
import Image from '../Image';

interface ImageLibrarySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (referenceImage: ReferenceImage) => void;
  imageType: 'style' | 'character' | 'scene';
}

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
`;

const ImageCard = styled.div<{ $isSelected: boolean }>`
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isSelected ? '#f0f4ff' : 'white'};
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ImageName = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #555;
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
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
              <ImageCard
                key={image.id}
                $isSelected={selectedImageId === image.id}
                onClick={() => handleImageSelect(image.id)}
              >
                <ImageContainer>
                  <Image
                    src={image.url}
                    alt={image.url.split('/').pop() || 'image'}
                    width="100%"
                    height="80px"
                    borderRadius="4px"
                    expandOnClick={true}
                    title="Click to view full resolution"
                  />
                </ImageContainer>
                <ImageName>
                  {image.url.split('/').pop() || 'image.jpg'}
                </ImageName>
              </ImageCard>
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