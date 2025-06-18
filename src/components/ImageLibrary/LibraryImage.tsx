import React from 'react';
import styled from 'styled-components';
import { Check } from 'react-feather';

interface LibraryImageProps {
  src: string;
  alt: string;
  isUsed?: boolean;
}

const ImageContainer = styled.div<{ $isUsed?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border: ${props => props.$isUsed ? '3px solid #4CAF50' : 'none'};
  border-radius: 4px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const LibraryImage: React.FC<LibraryImageProps> = ({ src, alt, isUsed = false }) => {
  return (
    <ImageContainer $isUsed={isUsed}>
      <StyledImage src={src} alt={alt} />
      {isUsed && (
        <CheckmarkOverlay>
          <Check size={16} />
        </CheckmarkOverlay>
      )}
    </ImageContainer>
  );
};

export default LibraryImage; 