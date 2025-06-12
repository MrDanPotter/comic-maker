import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import { isRectangular } from '../../utils/mathUtils';
import PanelImage from './PanelImage';
import ResizeIndicator from './ResizeIndicator';

interface SvgPanelProps {
  panels: Panel[];
  pageId: string;
  onPanelsUpdate: (panels: Panel[]) => void;
}

const PanelContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const EmptyPanelPolygon = styled.path<{ $isResizing: boolean }>`
  stroke: #333;
  stroke-width: 2px;
  fill: #f5f5f5;
  transition: ${props => props.$isResizing ? 'none' : 'd 0.5s ease-in-out'};
`;

const AnimatedGroup = styled.g<{ $isResizing: boolean }>`
  transition: ${props => props.$isResizing ? 'none' : 'd 0.5s ease-in-out'};
`;

interface ResizeGap {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
  panels: {
    panel: Panel;
    edge: 'top' | 'bottom' | 'left' | 'right';
  }[];
}

interface PanelBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const SvgPanel: React.FC<SvgPanelProps> = ({ panels, pageId, onPanelsUpdate }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [localPanels, setLocalPanels] = useState(panels);

  // Update local panels when prop changes
  React.useEffect(() => {
    setLocalPanels(panels);
  }, [panels]);

  const getPanelBounds = useCallback((panel: Panel): PanelBounds => ({
    left: Math.min(...panel.points.map(p => p[0])),
    right: Math.max(...panel.points.map(p => p[0])),
    top: Math.min(...panel.points.map(p => p[1])),
    bottom: Math.max(...panel.points.map(p => p[1]))
  }), []);

  const resizeGaps = useMemo(() => {
    const gaps: ResizeGap[] = [];
    const GAP_THRESHOLD = 20; // Maximum gap width to consider for resizing

    // Find vertical gaps (panels side by side)
    localPanels.forEach((panel1, i) => {
      // Skip if the current panel is not rectangular
      if (!isRectangular(panel1.points)) return;

      const bounds1 = getPanelBounds(panel1);
      
      // Find all panels that share a vertical border with panel1
      const rightNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough horizontally
        const isHorizontallyAdjacent = Math.abs(bounds1.right - bounds2.left) < GAP_THRESHOLD;
        // Check if panels overlap vertically
        const verticalOverlap = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);
        return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
      });

      const leftNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough horizontally
        const isHorizontallyAdjacent = Math.abs(bounds1.left - bounds2.right) < GAP_THRESHOLD;
        // Check if panels overlap vertically
        const verticalOverlap = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);
        return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
      });

      // Process right neighbors
      if (rightNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapTop = Math.max(
          bounds1.top,
          ...rightNeighbors.map(p => getPanelBounds(p).top)
        );
        const overlapBottom = Math.min(
          bounds1.bottom,
          ...rightNeighbors.map(p => getPanelBounds(p).bottom)
        );

        const x = (bounds1.right + Math.min(...rightNeighbors.map(p => getPanelBounds(p).left))) / 2;

        gaps.push({
          x1: x,
          y1: overlapTop,
          x2: x,
          y2: overlapBottom,
          isVertical: true,
          panels: [
            { panel: panel1, edge: 'right' },
            ...rightNeighbors.map(p => ({ panel: p, edge: 'left' as const }))
          ]
        });
      }

      // Process left neighbors
      if (leftNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapTop = Math.max(
          bounds1.top,
          ...leftNeighbors.map(p => getPanelBounds(p).top)
        );
        const overlapBottom = Math.min(
          bounds1.bottom,
          ...leftNeighbors.map(p => getPanelBounds(p).bottom)
        );

        const x = (bounds1.left + Math.max(...leftNeighbors.map(p => getPanelBounds(p).right))) / 2;

        gaps.push({
          x1: x,
          y1: overlapTop,
          x2: x,
          y2: overlapBottom,
          isVertical: true,
          panels: [
            { panel: panel1, edge: 'left' },
            ...leftNeighbors.map(p => ({ panel: p, edge: 'right' as const }))
          ]
        });
      }

      // Find horizontal gaps (panels stacked)
      const bottomNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough vertically
        const isVerticallyAdjacent = Math.abs(bounds1.bottom - bounds2.top) < GAP_THRESHOLD;
        // Check if panels overlap horizontally
        const horizontalOverlap = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
        return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
      });

      const topNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough vertically
        const isVerticallyAdjacent = Math.abs(bounds1.top - bounds2.bottom) < GAP_THRESHOLD;
        // Check if panels overlap horizontally
        const horizontalOverlap = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
        return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
      });

      // Process bottom neighbors
      if (bottomNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapLeft = Math.max(
          bounds1.left,
          ...bottomNeighbors.map(p => getPanelBounds(p).left)
        );
        const overlapRight = Math.min(
          bounds1.right,
          ...bottomNeighbors.map(p => getPanelBounds(p).right)
        );

        const y = (bounds1.bottom + Math.min(...bottomNeighbors.map(p => getPanelBounds(p).top))) / 2;

        gaps.push({
          x1: overlapLeft,
          y1: y,
          x2: overlapRight,
          y2: y,
          isVertical: false,
          panels: [
            { panel: panel1, edge: 'bottom' },
            ...bottomNeighbors.map(p => ({ panel: p, edge: 'top' as const }))
          ]
        });
      }

      // Process top neighbors
      if (topNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapLeft = Math.max(
          bounds1.left,
          ...topNeighbors.map(p => getPanelBounds(p).left)
        );
        const overlapRight = Math.min(
          bounds1.right,
          ...topNeighbors.map(p => getPanelBounds(p).right)
        );

        const y = (bounds1.top + Math.max(...topNeighbors.map(p => getPanelBounds(p).bottom))) / 2;

        gaps.push({
          x1: overlapLeft,
          y1: y,
          x2: overlapRight,
          y2: y,
          isVertical: false,
          panels: [
            { panel: panel1, edge: 'top' },
            ...topNeighbors.map(p => ({ panel: p, edge: 'bottom' as const }))
          ]
        });
      }
    });

    return gaps;
  }, [localPanels, getPanelBounds]);

  const handleResize = useCallback((updatedPanels: Panel[]) => {
    // Create a map of panel IDs to their updated versions
    const updatedPanelMap = new Map(updatedPanels.map(p => [p.id, p]));
    
    // Update all panels, using the updated version if available
    const newPanels = localPanels.map(panel => 
      updatedPanelMap.get(panel.id) || panel
    );

    // Update local state immediately for smooth resize indicator updates
    setLocalPanels(newPanels);
    // Propagate changes to parent
    onPanelsUpdate(newPanels);
  }, [localPanels, onPanelsUpdate]);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <PanelContainer className="comic-page-svg">
      {localPanels.map(panel => {
        const svgPath = pointsToSvgPath(panel.points);
        const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

        return (
          <AnimatedGroup key={panel.id} $isResizing={isResizing}>
            {panel.imageUrl ? (
              <PanelImage
                src={panel.imageUrl}
                panelId={panel.id}
                pageId={pageId}
                width={dropZone.width}
                height={dropZone.height}
                points={panel.points}
                dropZone={dropZone}
                isResizing={isResizing}
              />
            ) : (
              <EmptyPanelPolygon d={svgPath} $isResizing={isResizing} />
            )}
          </AnimatedGroup>
        );
      })}
      {resizeGaps.map((gap, index) => (
        <ResizeIndicator
          key={`gap-${index}`}
          x1={gap.x1}
          y1={gap.y1}
          x2={gap.x2}
          y2={gap.y2}
          isVertical={gap.isVertical}
          panels={gap.panels}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeEnd={handleResizeEnd}
        />
      ))}
    </PanelContainer>
  );
};

export default SvgPanel;
