import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';

interface ResizeIndicatorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
}

const ResizeLine = styled.line<{ $isVertical: boolean }>`
  stroke: red;
  stroke-width: 2;
  opacity: 0;
  cursor: ${props => props.$isVertical ? 'ew-resize' : 'ns-resize'};
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const ResizeArea = styled.rect<{ $isVertical: boolean }>`
  fill: transparent;
  cursor: ${props => props.$isVertical ? 'ew-resize' : 'ns-resize'};

  &:hover + line {
    opacity: 1;
  }
`;

const RESIZE_AREA_WIDTH = 10; // Width of the invisible hit area

const ResizeIndicator: React.FC<ResizeIndicatorProps> = ({
  x1,
  y1,
  x2,
  y2,
  isVertical
}) => {
  // Calculate the hit area rectangle dimensions
  const hitAreaX = isVertical ? x1 - RESIZE_AREA_WIDTH / 2 : x1;
  const hitAreaY = isVertical ? y1 : y1 - RESIZE_AREA_WIDTH / 2;
  const hitAreaWidth = isVertical ? RESIZE_AREA_WIDTH : x2 - x1;
  const hitAreaHeight = isVertical ? y2 - y1 : RESIZE_AREA_WIDTH;

  return (
    <>
      <ResizeArea
        x={hitAreaX}
        y={hitAreaY}
        width={hitAreaWidth}
        height={hitAreaHeight}
        $isVertical={isVertical}
      />
      <ResizeLine
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        $isVertical={isVertical}
      />
    </>
  );
};

export default ResizeIndicator; 