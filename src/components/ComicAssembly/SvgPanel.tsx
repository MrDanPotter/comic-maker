import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import { isRectangular } from '../../utils/mathUtils';
import PanelImage from './PanelImage';
import ResizeIndicator from './ResizeIndicator';

interface SvgPanelProps {
  panels: Panel[];
  pageId: string;
}

const PanelContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const EmptyPanelPolygon = styled.path`
  stroke: #333;
  stroke-width: 2px;
  fill: #f5f5f5;
  transition: d 0.5s ease-in-out;
`;

const AnimatedGroup = styled.g`
  transition: transform 0.5s ease-in-out;
`;

interface ResizeGap {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
}

interface PanelBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const SvgPanel: React.FC<SvgPanelProps> = ({ panels, pageId }) => {
  const resizeGaps = useMemo(() => {
    const gaps: ResizeGap[] = [];
    const GAP_THRESHOLD = 20; // Maximum gap width to consider for resizing

    // Helper function to get panel bounds
    const getPanelBounds = (panel: Panel): PanelBounds => ({
      left: Math.min(...panel.points.map(p => p[0])),
      right: Math.max(...panel.points.map(p => p[0])),
      top: Math.min(...panel.points.map(p => p[1])),
      bottom: Math.max(...panel.points.map(p => p[1]))
    });

    // Find vertical gaps (panels side by side)
    panels.forEach((panel1, i) => {
      // Skip if the current panel is not rectangular
      if (!isRectangular(panel1.points)) return;

      const bounds1 = getPanelBounds(panel1);
      
      // Find all panels that share a vertical border with panel1
      const rightNeighbors = panels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        return Math.abs(bounds1.right - bounds2.left) < GAP_THRESHOLD && isRectangular(panel2.points);
      });

      const leftNeighbors = panels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        return Math.abs(bounds1.left - bounds2.right) < GAP_THRESHOLD && isRectangular(panel2.points);
      });

      // Process right neighbors
      if (rightNeighbors.length > 0) {
        // Find the full extent of the shared border
        const y1 = Math.min(...rightNeighbors.map(p => getPanelBounds(p).top));
        const y2 = Math.max(...rightNeighbors.map(p => getPanelBounds(p).bottom));
        const x = (bounds1.right + Math.min(...rightNeighbors.map(p => getPanelBounds(p).left))) / 2;

        // Only add if there's a meaningful vertical overlap
        if (y2 > y1 && y1 < bounds1.bottom && y2 > bounds1.top) {
          gaps.push({
            x1: x,
            y1: Math.max(y1, bounds1.top),
            x2: x,
            y2: Math.min(y2, bounds1.bottom),
            isVertical: true
          });
        }
      }

      // Process left neighbors
      if (leftNeighbors.length > 0) {
        const y1 = Math.min(...leftNeighbors.map(p => getPanelBounds(p).top));
        const y2 = Math.max(...leftNeighbors.map(p => getPanelBounds(p).bottom));
        const x = (bounds1.left + Math.max(...leftNeighbors.map(p => getPanelBounds(p).right))) / 2;

        if (y2 > y1 && y1 < bounds1.bottom && y2 > bounds1.top) {
          gaps.push({
            x1: x,
            y1: Math.max(y1, bounds1.top),
            x2: x,
            y2: Math.min(y2, bounds1.bottom),
            isVertical: true
          });
        }
      }

      // Find horizontal gaps (panels stacked)
      const bottomNeighbors = panels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        return Math.abs(bounds1.bottom - bounds2.top) < GAP_THRESHOLD && isRectangular(panel2.points);
      });

      const topNeighbors = panels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        return Math.abs(bounds1.top - bounds2.bottom) < GAP_THRESHOLD && isRectangular(panel2.points);
      });

      // Process bottom neighbors
      if (bottomNeighbors.length > 0) {
        const x1 = Math.min(...bottomNeighbors.map(p => getPanelBounds(p).left));
        const x2 = Math.max(...bottomNeighbors.map(p => getPanelBounds(p).right));
        const y = (bounds1.bottom + Math.min(...bottomNeighbors.map(p => getPanelBounds(p).top))) / 2;

        if (x2 > x1 && x1 < bounds1.right && x2 > bounds1.left) {
          gaps.push({
            x1: Math.max(x1, bounds1.left),
            y1: y,
            x2: Math.min(x2, bounds1.right),
            y2: y,
            isVertical: false
          });
        }
      }

      // Process top neighbors
      if (topNeighbors.length > 0) {
        const x1 = Math.min(...topNeighbors.map(p => getPanelBounds(p).left));
        const x2 = Math.max(...topNeighbors.map(p => getPanelBounds(p).right));
        const y = (bounds1.top + Math.max(...topNeighbors.map(p => getPanelBounds(p).bottom))) / 2;

        if (x2 > x1 && x1 < bounds1.right && x2 > bounds1.left) {
          gaps.push({
            x1: Math.max(x1, bounds1.left),
            y1: y,
            x2: Math.min(x2, bounds1.right),
            y2: y,
            isVertical: false
          });
        }
      }
    });

    return gaps;
  }, [panels]);

  return (
    <PanelContainer>
      {panels.map(panel => {
        const svgPath = pointsToSvgPath(panel.points);
        const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

        return (
          <AnimatedGroup key={panel.id}>
            {panel.imageUrl ? (
              <PanelImage
                src={panel.imageUrl}
                panelId={panel.id}
                pageId={pageId}
                width={dropZone.width}
                height={dropZone.height}
                points={panel.points}
                dropZone={dropZone}
              />
            ) : (
              <EmptyPanelPolygon d={svgPath} />
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
        />
      ))}
    </PanelContainer>
  );
};

export default SvgPanel;
