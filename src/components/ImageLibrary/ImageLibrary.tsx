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
}

const LibraryContainer = styled.div`
  width: 300px;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
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

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  min-height: 10px; /* Ensure the container is always present */
`;

const DraggableImage = styled.div<{ $isDragging?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  
  &:hover {
    border-color: #2196f3;
  }
`;

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onImageUpload, images }) => {
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
    <LibraryContainer>
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
      
      <Droppable droppableId="image-library" type="IMAGE_LIBRARY">
        {(provided) => (
          <ImagePreviewContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {images.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id} index={index}>
                {(provided, snapshot) => (
                  <DraggableImage
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    $isDragging={snapshot.isDragging}
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