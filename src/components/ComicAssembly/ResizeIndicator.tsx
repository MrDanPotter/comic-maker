import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { getBoundingBox } from '../../utils/polygonUtils';

// Throttle utility function
const THROTTLE_DELAY = 30; // 30ms throttle delay for smooth but less frequent updates

interface ResizeIndicatorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
  panels: {
    panel: Panel;
    edge: 'top' | 'bottom' | 'left' | 'right';
  }[];
  onResize: (panels: Panel[]) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
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

const ResizeArea = styled.rect<{ $isVertical: boolean; $isDragging: boolean }>`
  fill: transparent;
  cursor: ${props => props.$isVertical ? 'ew-resize' : 'ns-resize'};
  pointer-events: ${props => props.$isDragging ? 'none' : 'auto'};

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
  isVertical,
  panels,
  onResize,
  onResizeStart,
  onResizeEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const lastUpdatePos = useRef<{ x: number, y: number } | null>(null);

  // Calculate the hit area rectangle dimensions
  const hitAreaX = isVertical ? x1 - RESIZE_AREA_WIDTH / 2 : x1;
  const hitAreaY = isVertical ? y1 : y1 - RESIZE_AREA_WIDTH / 2;
  const hitAreaWidth = isVertical ? RESIZE_AREA_WIDTH : x2 - x1;
  const hitAreaHeight = isVertical ? y2 - y1 : RESIZE_AREA_WIDTH;

  const getMousePosition = useCallback((e: MouseEvent | React.MouseEvent, svg: SVGGraphicsElement) => {
    const svgRoot = svg.closest('svg') as SVGSVGElement;
    if (!svgRoot) {
      console.log('No SVG root found');
      return { x: 0, y: 0 };
    }

    const CTM = svg.getScreenCTM();
    if (!CTM) {
      console.log('No CTM found');
      return { x: 0, y: 0 };
    }

    const point = svgRoot.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    const transformedPoint = point.matrixTransform(CTM.inverse());
    console.log('Mouse position:', { raw: { x: e.clientX, y: e.clientY }, transformed: transformedPoint });
    return {
      x: transformedPoint.x,
      y: transformedPoint.y
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !startPos || !lastPos) {
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - lastUpdateTime.current;

    const svg = document.querySelector('.comic-page-svg');
    if (!(svg instanceof SVGGraphicsElement)) {
      return;
    }

    const currentPos = getMousePosition(e, svg);
    if (!currentPos) {
      return;
    }

    // Only update if enough time has passed
    if (timeSinceLastUpdate >= THROTTLE_DELAY) {
      // Calculate delta from the last update position (or last position if no updates yet)
      const basePos = lastUpdatePos.current || lastPos;
      const deltaX = isVertical ? currentPos.x - basePos.x : 0;
      const deltaY = isVertical ? 0 : currentPos.y - basePos.y;

      // Update panel points based on the movement
      const updatedPanels = panels.map(({ panel, edge }) => {
        let edgePoints: number[] = [];
        if (isVertical) {
          const edgeX = edge === 'left' ? Math.min(...panel.points.map(p => p[0])) : Math.max(...panel.points.map(p => p[0]));
          edgePoints = panel.points.map((_, idx) => idx).filter(i => Math.abs(panel.points[i][0] - edgeX) < 1);
        } else {
          const edgeY = edge === 'top' ? Math.min(...panel.points.map(p => p[1])) : Math.max(...panel.points.map(p => p[1]));
          edgePoints = panel.points.map((_, idx) => idx).filter(i => Math.abs(panel.points[i][1] - edgeY) < 1);
        }

        const newPoints = panel.points.map((point, idx) => {
          if (edgePoints.includes(idx)) {
            const [x, y] = point;
            if (isVertical && (edge === 'left' || edge === 'right')) {
              return [x + deltaX, y] as [number, number];
            } else if (!isVertical && (edge === 'top' || edge === 'bottom')) {
              return [x, y + deltaY] as [number, number];
            }
          }
          return point;
        });

        return {
          ...panel,
          points: newPoints,
          dropZone: getBoundingBox(newPoints)
        };
      });

      // Update last update position and time
      lastUpdatePos.current = currentPos;
      lastUpdateTime.current = currentTime;

      // Update last position with only the relevant axis
      setLastPos({
        x: isVertical ? currentPos.x : lastPos.x,
        y: isVertical ? lastPos.y : currentPos.y
      });

      onResize(updatedPanels);
    }
  }, [isDragging, startPos, lastPos, panels, isVertical, onResize, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setStartPos(null);
    setLastPos(null);
    lastUpdatePos.current = null;
    onResizeEnd?.();
  }, [onResizeEnd]);

  useEffect(() => {
    if (isDragging) {
      console.log('Adding event listeners');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        console.log('Removing event listeners');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    console.log('Mouse down event');
    const svg = e.currentTarget.closest('svg');
    if (!(svg instanceof SVGGraphicsElement)) {
      console.log('No SVG element found');
      return;
    }

    const position = getMousePosition(e, svg);
    if (!position) {
      console.log('Failed to get start position');
      return;
    }

    console.log('Start position:', position);
    setStartPos(position);
    setLastPos(position);
    setIsDragging(true);
    onResizeStart?.();
    console.log('Started dragging');
  };

  return (
    <>
      <ResizeArea
        x={hitAreaX}
        y={hitAreaY}
        width={hitAreaWidth}
        height={hitAreaHeight}
        $isVertical={isVertical}
        $isDragging={isDragging}
        onMouseDown={handleMouseDown}
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