import React from 'react';
import styled from 'styled-components';
import { ReferenceImage } from '../../store/slices/appStateSlice';
import Image from '../Image';

interface ReferenceImageCardProps {
  image: ReferenceImage;
  isSelected?: boolean;
  isReferenced?: boolean;
  showStatusIndicator?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const CardContainer = styled.div<{ $isSelected: boolean; $isReferenced: boolean; $isClickable: boolean; $size: string }>`
  border: 2px solid ${props => props.$isSelected ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  padding: ${props => props.$size === 'small' ? '8px' : props.$size === 'large' ? '16px' : '12px'};
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

const ImageContainer = styled.div<{ $size: string }>`
  width: 100%;
  height: ${props => props.$size === 'small' ? '80px' : props.$size === 'large' ? '160px' : '120px'};
  margin-bottom: ${props => props.$size === 'small' ? '6px' : '8px'};
  border-radius: 4px;
  overflow: hidden;
`;

const ImageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ImageType = styled.span<{ $size: string }>`
  font-family: 'Roboto', sans-serif;
  font-size: ${props => props.$size === 'small' ? '0.7rem' : props.$size === 'large' ? '1rem' : '0.8rem'};
  color: #667eea;
  font-weight: 500;
  text-transform: capitalize;
`;

const CustomName = styled.span<{ $size: string }>`
  font-family: 'Roboto', sans-serif;
  font-size: ${props => props.$size === 'small' ? '0.7rem' : props.$size === 'large' ? '1rem' : '0.8rem'};
  color: #666;
  font-style: italic;
`;

const StatusText = styled.span<{ $isReferenced: boolean; $size: string }>`
  font-family: 'Roboto', sans-serif;
  font-size: ${props => props.$size === 'small' ? '0.6rem' : props.$size === 'large' ? '0.9rem' : '0.7rem'};
  color: ${props => props.$isReferenced ? '#4caf50' : '#ff9800'};
  font-weight: 500;
`;

const ReferenceImageCard: React.FC<ReferenceImageCardProps> = ({
  image,
  isSelected = false,
  isReferenced = true,
  onClick,
  showStatusIndicator = true,
  size = 'medium'
}) => {

  const getStatusText = (isReferenced: boolean): string => {
    return isReferenced ? 'Referenced' : 'Not referenced';
  };

  return (
    <CardContainer
      $isSelected={isSelected}
      $isReferenced={isReferenced}
      $isClickable={!!onClick}
      $size={size}
      onClick={onClick}
    >
      <ImageContainer $size={size}>
        <Image
          src={image.url}
          alt={image.name}
          width="100%"
          height={size === 'small' ? '80px' : size === 'large' ? '160px' : '120px'}
          borderRadius="4px"
          expandable={true}
          title="Click to view full resolution"
        />
      </ImageContainer>
      
      <ImageInfo>
        <ImageType $size={size}>{image.type}</ImageType>
        {image.customName && (
          <CustomName $size={size}>"{image.customName}"</CustomName>
        )}
        {showStatusIndicator && (
          <StatusText $isReferenced={isReferenced} $size={size}>
            {getStatusText(isReferenced)}
          </StatusText>
        )}
      </ImageInfo>
    </CardContainer>
  );
};

export default ReferenceImageCard; 