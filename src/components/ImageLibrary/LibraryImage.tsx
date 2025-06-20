import React from 'react';
import styled from 'styled-components';
import { Check, Download, Trash2 } from 'react-feather';

interface LibraryImageProps {
  src: string;
  alt: string;
  isUsed?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
}

const ImageContainer = styled.div<{ $isUsed?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: ${props => props.$isUsed ? '3px solid #4CAF50' : 'none'};
  border-radius: 4px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const CheckmarkOverlay = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #4CAF50;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ActionButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const DownloadButton = styled(ActionButton)`
  &:hover {
    background: rgba(33, 150, 243, 0.9);
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background: rgba(220, 53, 69, 0.9);
  }
`;

const ImageContainerWithHover = styled(ImageContainer)`
  &:hover ${ActionButtons} {
    opacity: 1;
  }
`;

const LibraryImage: React.FC<LibraryImageProps> = ({ 
  src, 
  alt, 
  isUsed = false, 
  onDownload, 
  onDelete 
}) => {
  return (
    <ImageContainerWithHover $isUsed={isUsed}>
      <StyledImage src={src} alt={alt} />
      {(onDownload || onDelete) && (
        <ActionButtons>
          {onDownload && (
            <DownloadButton onClick={onDownload} title="Download image">
              <Download size={12} />
            </DownloadButton>
          )}
          {onDelete && (
            <DeleteButton onClick={onDelete} title="Delete image">
              <Trash2 size={12} />
            </DeleteButton>
          )}
        </ActionButtons>
      )}
      {isUsed && (
        <CheckmarkOverlay>
          <Check size={16} />
        </CheckmarkOverlay>
      )}
    </ImageContainerWithHover>
  );
};

export default LibraryImage; 