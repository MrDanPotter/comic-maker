import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { getBoundingBox } from '../../utils/polygonUtils';

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
    console.log('Move handler called, isDragging:', isDragging);
    if (!isDragging || !startPos || !lastPos) {
      console.log('Move ignored - not dragging or missing positions');
      return;
    }

    const svg = document.querySelector('.comic-page-svg');
    if (!(svg instanceof SVGGraphicsElement)) {
      console.log('No SVG element found during move');
      return;
    }

    const currentPos = getMousePosition(e, svg);
    if (!currentPos) {
      console.log('Failed to get current position');
      return;
    }

    // Calculate the delta from the last position
    const deltaX = currentPos.x - lastPos.x;
    const deltaY = currentPos.y - lastPos.y;
    console.log('Delta:', { deltaX, deltaY });

    // Update panel points based on the movement
    const updatedPanels = panels.map(({ panel, edge }) => {
      // Find the points that are on the edge being resized
      let edgePoints: number[] = [];
      if (isVertical) {
        const edgeX = edge === 'left' ? Math.min(...panel.points.map(p => p[0])) : Math.max(...panel.points.map(p => p[0]));
        edgePoints = panel.points.map((_, idx) => idx).filter(i => Math.abs(panel.points[i][0] - edgeX) < 1);
      } else {
        const edgeY = edge === 'top' ? Math.min(...panel.points.map(p => p[1])) : Math.max(...panel.points.map(p => p[1]));
        edgePoints = panel.points.map((_, idx) => idx).filter(i => Math.abs(panel.points[i][1] - edgeY) < 1);
      }

      const newPoints = panel.points.map((point, idx) => {
        // Only move points that are on the edge being resized
        if (edgePoints.includes(idx)) {
          const [x, y] = point;
          if (isVertical) {
            if (edge === 'left' || edge === 'right') {
              console.log('Moving vertical point:', { from: [x, y], to: [x + deltaX, y] });
              return [x + deltaX, y] as [number, number];
            }
          } else {
            if (edge === 'top' || edge === 'bottom') {
              console.log('Moving horizontal point:', { from: [x, y], to: [x, y + deltaY] });
              return [x, y + deltaY] as [number, number];
            }
          }
        }
        return point;
      });

      const updatedPanel = {
        ...panel,
        points: newPoints,
        dropZone: getBoundingBox(newPoints)
      };
      console.log('Updated panel:', { id: panel.id, edge, newPoints });
      return updatedPanel;
    });

    setLastPos(currentPos);
    console.log('Calling onResize with updated panels');
    onResize(updatedPanels);
  }, [isDragging, startPos, lastPos, panels, isVertical, onResize, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    console.log('Mouse up - ending drag');
    setIsDragging(false);
    setStartPos(null);
    setLastPos(null);
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