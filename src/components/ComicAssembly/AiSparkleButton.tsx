import React from 'react';
import styled from 'styled-components';

interface AiSparkleButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const ButtonContainer = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.2s ease;
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
`;

const SparkleButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: sparkle 2s infinite;
  }
  
  @keyframes sparkle {
    0% {
      transform: rotate(45deg) translateX(-100%);
    }
    100% {
      transform: rotate(45deg) translateX(100%);
    }
  }
`;

const SparkleIcon = styled.div`
  position: relative;
  z-index: 1;
  font-size: 24px;
  
  &::before {
    content: '✨';
  }
`;

const AiSparkleButton: React.FC<AiSparkleButtonProps> = ({ onClick, isVisible }) => {
  return (
    <ButtonContainer $isVisible={isVisible}>
      <SparkleButton onClick={onClick} title="Generate AI Image">
        <SparkleIcon />
      </SparkleButton>
    </ButtonContainer>
  );
};

export default AiSparkleButton; 