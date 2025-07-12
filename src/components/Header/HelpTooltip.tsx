import React, { useState } from 'react';
import styled from 'styled-components';
import { HelpCircle } from 'react-feather';

interface HelpTooltipProps {
  content: string;
  ariaLabel?: string;
  size?: number;
}

const HelpIcon = styled.div<{ size?: number }>`
  position: relative;
  cursor: pointer;
  color: #667eea;
  transition: color 0.2s ease;
  
  &:hover {
    color: #5a6fd8;
  }
  
  svg {
    width: ${props => props.size || 18}px;
    height: ${props => props.size || 18}px;
  }
`;

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  margin-top: 8px;
  width: 300px;
  white-space: normal;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-bottom-color: #333;
  }
  
  &.Tooltip {
    /* This class is used for print styles */
  }
`;

const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  content, 
  ariaLabel = "Help information",
  size = 18 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleShow = () => {
    setIsVisible(true);
  };

  const handleHide = () => {
    setIsVisible(false);
  };

  return (
    <HelpIcon
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      size={size}
    >
      <HelpCircle />
      <Tooltip $isVisible={isVisible} className="Tooltip">
        {content}
      </Tooltip>
    </HelpIcon>
  );
};

export default HelpTooltip; 