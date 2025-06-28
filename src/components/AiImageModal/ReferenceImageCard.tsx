import React from 'react';
import styled from 'styled-components';
import { X } from 'react-feather';
import { ReferenceImage } from '../../store/slices/appStateSlice';
import Image from '../Image';

interface ReferenceImageCardProps {
  image: ReferenceImage;
  isSelected?: boolean;
  isReferenced?: boolean;
  showStatusIndicator?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

const CardContainer = styled.div<{ $isSelected: boolean; $isReferenced: boolean; $isClickable: boolean }>`
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  padding: 12px;
  background: ${props => props.$isSelected ? '#f0f4ff' : 'white'};
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: ${props => props.$isClickable ? '#667eea' : props.$isSelected ? '#667eea' : '#e0e0e0'};
    transform: ${props => props.$isClickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$isClickable ? '0 4px 12px rgba(102, 126, 234, 0.15)' : 'none'};
  }
`;

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const ImageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ImageType = styled.span`
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

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
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
    width: 14px;
    height: 14px;
  }
`;

const ReferenceImageCard: React.FC<ReferenceImageCardProps> = ({
  image,
  isSelected = false,
  isReferenced = true,
  onClick,
  onRemove,
  showStatusIndicator = true
}) => {

  const getStatusText = (isReferenced: boolean): string => {
    return isReferenced ? 'Referenced' : 'Not referenced';
  };

  return (
    <CardContainer
      $isSelected={isSelected}
      $isReferenced={isReferenced}
      $isClickable={!!onClick}
      onClick={onClick}
    >
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
        <Image
          src={image.url}
          alt={image.name}
          width="100%"
          height="120px"
          borderRadius="4px"
          expandable={true}
          title="Click to view full resolution"
        />
      </ImageContainer>
      
      <ImageInfo>
        <ImageType>{image.type}</ImageType>
        {image.customName && (
          <CustomName>"{image.customName}"</CustomName>
        )}
        {showStatusIndicator && (
          <StatusText $isReferenced={isReferenced}>
            {getStatusText(isReferenced)}
          </StatusText>
        )}
      </ImageInfo>
    </CardContainer>
  );
};

export default ReferenceImageCard; 