import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useAppDispatch } from '../../store/store';
import { removeImage, markImageAsDownloaded } from '../../store/slices/imageLibrarySlice';
import LibraryImage from './LibraryImage';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Image } from '../../types/comic';

interface ImageLibraryProps {
  onImageUpload: (files: FileList) => void;
  images: Image[];
  isHorizontal?: boolean;
}

const LibraryContainer = styled.div<{ $isHorizontal?: boolean }>`
  width: ${props => props.$isHorizontal ? '100%' : '300px'};
  height: ${props => props.$isHorizontal ? '100%' : '100vh'};
  background: #f0f0f0;
  padding: 20px;
  padding-top: 80px; //TODO: This is a hack to make the image library not overlap with the header, but it's not a good solution.
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
  const dispatch = useAppDispatch();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmDelete = () => {
    if (selectedImageId) {
      dispatch(removeImage(selectedImageId));
      setSelectedImageId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDownloadThenDelete = () => {
    if (selectedImageId) {
      dispatch(markImageAsDownloaded(selectedImageId));
      dispatch(removeImage(selectedImageId));
      setSelectedImageId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDownload = (image: Image) => {
    if (image.source === 'ai') {
      dispatch(markImageAsDownloaded(image.id));
      
      // Create a download link
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `ai-image-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteClick = (image: Image) => {
    if (image.source === 'ai' && !image.isDownloaded) {
      setSelectedImageId(image.id);
      setShowDeleteConfirmation(true);
    } else {
      dispatch(removeImage(image.id));
    }
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
                      isUsed={image.isUsed}
                      onDownload={image.source === 'ai' ? () => handleDownload(image) : undefined}
                      onDelete={() => handleDeleteClick(image)}
                    />
                  </DraggableImage>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ImagePreviewContainer>
        )}
      </Droppable>
      {showDeleteConfirmation && selectedImageId && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirmDelete={handleConfirmDelete}
          onDownloadThenDelete={handleDownloadThenDelete}
        />
      )}
    </LibraryContainer>
  );
};

export default ImageLibrary; 