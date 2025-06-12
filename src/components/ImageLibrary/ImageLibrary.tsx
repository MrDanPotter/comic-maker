import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import LibraryImage from './LibraryImage';

interface ImageLibraryProps {
  onImageUpload: (files: FileList) => void;
  images: Array<{
    id: string;
    url: string;
    isPlaced?: boolean;
  }>;
  isHorizontal?: boolean;
}

const LibraryContainer = styled.div<{ $isHorizontal?: boolean }>`
  width: ${props => props.$isHorizontal ? '100%' : '300px'};
  height: ${props => props.$isHorizontal ? '100%' : '100vh'};
  background: #f0f0f0;
  padding: 20px;
  overflow-y: ${props => props.$isHorizontal ? 'hidden' : 'auto'};
  overflow-x: ${props => props.$isHorizontal ? 'auto' : 'hidden'};
  position: ${props => props.$isHorizontal ? 'relative' : 'fixed'};
  right: ${props => props.$isHorizontal ? 'auto' : '0'};
  top: ${props => props.$isHorizontal ? 'auto' : '0'};
  display: ${props => props.$isHorizontal ? 'flex' : 'block'};
  flex-direction: ${props => props.$isHorizontal ? 'column' : 'column'};
  min-width: ${props => props.$isHorizontal ? '300px' : 'auto'};
`;

const ButtonContainer = styled.div<{ $isHorizontal?: boolean }>`
  display: ${props => props.$isHorizontal ? 'flex' : 'block'};
  gap: ${props => props.$isHorizontal ? '10px' : '0'};
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const PrintButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 10px;
  border: none;
  
  &:hover {
    background: #45a049;
  }

  @media print {
    display: none;
  }
`;

const UploadButton = styled.label`
  display: block;
  width: 100%;
  padding: 10px;
  background: #2196f3;
  color: white;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 20px;
  
  &:hover {
    background: #1976d2;
  }
`;

const ImagePreviewContainer = styled.div<{ $isHorizontal?: boolean }>`
  display: ${props => props.$isHorizontal ? 'flex' : 'grid'};
  grid-template-columns: ${props => props.$isHorizontal ? 'none' : 'repeat(2, 1fr)'};
  gap: 10px;
  min-height: 10px;
  flex-wrap: ${props => props.$isHorizontal ? 'nowrap' : 'wrap'};
  overflow-x: ${props => props.$isHorizontal ? 'auto' : 'visible'};
  flex: 1;
`;

const DraggableImage = styled.div<{ $isDragging?: boolean; $isHorizontal?: boolean }>`
  width: ${props => props.$isHorizontal ? '120px' : '100%'};
  aspect-ratio: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  flex-shrink: 0;
  
  &:hover {
    border-color: #2196f3;
  }
`;

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onImageUpload, images, isHorizontal = false }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <LibraryContainer $isHorizontal={isHorizontal}>
      <ButtonContainer $isHorizontal={isHorizontal}>
        <PrintButton onClick={handlePrint}>Print</PrintButton>
        <UploadButton>
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </UploadButton>
      </ButtonContainer>
      
      <Droppable droppableId="image-library" type="IMAGE_LIBRARY">
        {(provided) => (
          <ImagePreviewContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isHorizontal={isHorizontal}
          >
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided, snapshot) => (
                  <DraggableImage
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    $isDragging={snapshot.isDragging}
                    $isHorizontal={isHorizontal}
                  >
                    <LibraryImage 
                      src={image.url} 
                      alt={`Library item ${index + 1}`}
                      isPlaced={image.isPlaced}
                    />
                  </DraggableImage>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ImagePreviewContainer>
        )}
      </Droppable>
    </LibraryContainer>
  );
};

export default ImageLibrary; 