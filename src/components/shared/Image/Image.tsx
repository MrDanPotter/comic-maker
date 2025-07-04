import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface ImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string;
  expandOnClick?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export interface ImageRef {
  expand: () => void;
}

const ImageContainer = styled.div<{ 
  $width?: string | number; 
  $height?: string | number;
  $borderRadius?: string;
  $expandOnClick?: boolean;
}>`
  position: relative;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || 'auto'};
  border-radius: ${props => props.$borderRadius || '0'};
  overflow: hidden;
  cursor: ${props => props.$expandOnClick ? 'pointer' : 'default'};
`;

const StyledImage = styled.img<{ 
  $objectFit?: string;
  $expandOnClick?: boolean;
}>`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.$objectFit || 'cover'};
  object-position: center;
  transition: ${props => props.$expandOnClick ? 'transform 0.2s ease, box-shadow 0.2s ease' : 'none'};
  
  ${props => props.$expandOnClick && `
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  `}
`;

// Full resolution image overlay
const FullResOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.$isOpen ? 'fadeIn' : 'fadeOut'} 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const FullResImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
  
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Image = forwardRef<ImageRef, ImageProps>(({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  borderRadius,
  expandOnClick = false,
  className,
  onClick,
  title
}, ref) => {
  const [showFullRes, setShowFullRes] = useState(false);

  useImperativeHandle(ref, () => ({
    expand: () => {
      setShowFullRes(true);
    }
  }));

  const handleImageClick = () => {
    if (expandOnClick) {
      setShowFullRes(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleFullResClose = () => {
    setShowFullRes(false);
  };

  return (
    <>
      <ImageContainer
        $width={width}
        $height={height}
        $borderRadius={borderRadius}
        $expandOnClick={expandOnClick}
        className={className}
        onClick={handleImageClick}
        title={title}
      >
        <StyledImage
          src={src}
          alt={alt}
          $objectFit={objectFit}
          $expandOnClick={expandOnClick}
        />
      </ImageContainer>
      
      {/* Full resolution image overlay - rendered at body level */}
      {typeof document !== 'undefined' && createPortal(
        <FullResOverlay $isOpen={showFullRes} onClick={handleFullResClose}>
          <FullResImage 
            src={src} 
            alt={alt}
            onClick={(e) => e.stopPropagation()}
          />
        </FullResOverlay>,
        document.body
      )}
    </>
  );
});

Image.displayName = 'Image';

export default Image; 