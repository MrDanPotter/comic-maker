import React, { useRef } from 'react';
import styled from 'styled-components';
import { X, Maximize2 } from 'react-feather';
import { ReferenceImage } from '../../store/slices/appStateSlice';
import { Image } from '../../types/comic';
import ImageComponent, { ImageRef } from '../Image';

interface ReferenceImageCardProps {
  image: ReferenceImage | Image;
  isSelected?: boolean;
  isReferenced?: boolean;
  showStatusIndicator?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onExpand?: () => void;
}

const CardContainer = styled.div<{ $isSelected: boolean; $isReferenced: boolean; $isClickable: boolean }>`
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  padding: 12px;
  background: ${props => props.$isSelected ? '#f0f4ff' : 'white'};
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: ${props => props.$isClickable ? '#667eea' : props.$isSelected ? '#667eea' : '#e0e0e0'};
    transform: ${props => props.$isClickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$isClickable ? '0 4px 12px rgba(102, 126, 234, 0.15)' : 'none'};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ImageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
`;

const ImageType = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
  text-transform: capitalize;
`;

const ImageSource = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
  text-transform: capitalize;
`;

const CustomName = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
`;

const StatusText = styled.span<{ $isReferenced: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-size: 0.7rem;
  color: ${props => props.$isReferenced ? '#4caf50' : '#ff9800'};
  font-weight: 500;
`;

const ImageStatus = styled.span<{ $isUsed: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-size: 0.7rem;
  color: ${props => props.$isUsed ? '#4caf50' : '#ff9800'};
  font-weight: 500;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 29px;
  height: 29px;
  border: 2px solid #d32f2f;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #d32f2f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
  
  &:hover {
    background: #d32f2f;
    color: white;
    transform: scale(1.1);
  }
  
  svg {
    width: 17px;
    height: 17px;
  }
`;

const ExpandButton = styled.button<{ $hasRemoveButton: boolean }>`
  position: absolute;
  top: 8px;
  right: ${props => props.$hasRemoveButton ? '42px' : '8px'};
  width: 29px;
  height: 29px;
  border: 2px solid #667eea;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }
  
  svg {
    width: 17px;
    height: 17px;
  }
`;

const ReferenceImageCard: React.FC<ReferenceImageCardProps> = ({
  image,
  isSelected = false,
  isReferenced = true,
  onClick,
  onRemove,
  onExpand,
  showStatusIndicator = true
}) => {
  const imageRef = useRef<ImageRef>(null);

  // Type guards to determine image type
  const isReferenceImage = (img: ReferenceImage | Image): img is ReferenceImage => {
    return 'type' in img && 'name' in img;
  };

  const isLibraryImage = (img: ReferenceImage | Image): img is Image => {
    return 'source' in img && 'isUsed' in img;
  };

  const getStatusText = (isReferenced: boolean): string => {
    return isReferenced ? 'Referenced' : 'Not referenced';
  };

  const getLibraryStatusText = (isUsed: boolean): string => {
    return isUsed ? 'Used in comic' : 'Available';
  };

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    } else if (imageRef.current) {
      imageRef.current.expand();
    }
  };

  const getImageAlt = () => {
    if (isReferenceImage(image)) {
      return image.name;
    }
    return `Image ${image.id}`;
  };

  const getImageType = () => {
    if (isReferenceImage(image)) {
      return image.type;
    }
    return image.source;
  };

  const getCustomName = () => {
    if (isReferenceImage(image)) {
      return image.customName;
    }
    if (isLibraryImage(image) && image.source === 'ai' && image.prompt) {
      return image.prompt;
    }
    return undefined;
  };

  const getStatusDisplay = () => {
    if (isReferenceImage(image)) {
      return showStatusIndicator ? (
        <StatusText $isReferenced={isReferenced}>
          {getStatusText(isReferenced)}
        </StatusText>
      ) : null;
    }
    return (
      <ImageStatus $isUsed={image.isUsed}>
        {getLibraryStatusText(image.isUsed)}
      </ImageStatus>
    );
  };

  return (
    <CardContainer
      $isSelected={isSelected}
      $isReferenced={isReferenced}
      $isClickable={!!onClick}
      onClick={onClick}
    >
      <ExpandButton 
        $hasRemoveButton={!!onRemove}
        onClick={(e) => {
          e.stopPropagation();
          handleExpand();
        }}
        title="Expand image"
      >
        <Maximize2 />
      </ExpandButton>
      
      {onRemove && (
        <RemoveButton 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove reference image"
        >
          <X />
        </RemoveButton>
      )}
      
      <ImageContainer>
        <ImageComponent
          ref={imageRef}
          src={image.url}
          alt={getImageAlt()}
          width="100%"
          height="100%"
          borderRadius="4px"
          expandOnClick={false}
        />
      </ImageContainer>
      
      <ImageInfo>
        {isReferenceImage(image) ? (
          <ImageType>{getImageType()}</ImageType>
        ) : (
          <ImageSource>{getImageType()}</ImageSource>
        )}
        {getCustomName() && (
          <CustomName>"{getCustomName()}"</CustomName>
        )}
        {getStatusDisplay()}
      </ImageInfo>
    </CardContainer>
  );
};

export default ReferenceImageCard; 