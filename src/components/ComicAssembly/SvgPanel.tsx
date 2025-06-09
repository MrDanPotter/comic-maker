import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
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
    const getPanelBounds = (panel: Panel): PanelBounds => {
      return {
        left: Math.min(...panel.points.map(p => p[0])),
        right: Math.max(...panel.points.map(p => p[0])),
        top: Math.min(...panel.points.map(p => p[1])),
        bottom: Math.max(...panel.points.map(p => p[1]))
      };
    };

    // Helper function to check if two panels share a vertical edge
    const hasVerticalEdge = (panel1Bounds: PanelBounds, panel2Bounds: PanelBounds): boolean => {
      return Math.abs(panel1Bounds.right - panel2Bounds.left) < GAP_THRESHOLD ||
             Math.abs(panel1Bounds.left - panel2Bounds.right) < GAP_THRESHOLD;
    };

    // Helper function to check if two panels share a horizontal edge
    const hasHorizontalEdge = (panel1Bounds: PanelBounds, panel2Bounds: PanelBounds): boolean => {
      return Math.abs(panel1Bounds.bottom - panel2Bounds.top) < GAP_THRESHOLD ||
             Math.abs(panel1Bounds.top - panel2Bounds.bottom) < GAP_THRESHOLD;
    };

    // Process each panel
    panels.forEach((mainPanel, i) => {
      const mainBounds = getPanelBounds(mainPanel);
      
      // Find all panels that share a vertical edge with the main panel
      const rightNeighbors: { panel: Panel; bounds: PanelBounds }[] = [];
      const leftNeighbors: { panel: Panel; bounds: PanelBounds }[] = [];

      // Find all panels that share a horizontal edge with the main panel
      const topNeighbors: { panel: Panel; bounds: PanelBounds }[] = [];
      const bottomNeighbors: { panel: Panel; bounds: PanelBounds }[] = [];

      panels.slice(i + 1).forEach(otherPanel => {
        const otherBounds = getPanelBounds(otherPanel);

        // Check vertical alignment
        if (hasVerticalEdge(mainBounds, otherBounds)) {
          // Check if there's any vertical overlap
          const verticalOverlap = !(mainBounds.bottom < otherBounds.top || otherBounds.bottom < mainBounds.top);
          if (verticalOverlap) {
            if (Math.abs(mainBounds.right - otherBounds.left) < GAP_THRESHOLD) {
              rightNeighbors.push({ panel: otherPanel, bounds: otherBounds });
            } else if (Math.abs(mainBounds.left - otherBounds.right) < GAP_THRESHOLD) {
              leftNeighbors.push({ panel: otherPanel, bounds: otherBounds });
            }
          }
        }

        // Check horizontal alignment
        if (hasHorizontalEdge(mainBounds, otherBounds)) {
          // Check if there's any horizontal overlap
          const horizontalOverlap = !(mainBounds.right < otherBounds.left || otherBounds.right < mainBounds.left);
          if (horizontalOverlap) {
            if (Math.abs(mainBounds.bottom - otherBounds.top) < GAP_THRESHOLD) {
              bottomNeighbors.push({ panel: otherPanel, bounds: otherBounds });
            } else if (Math.abs(mainBounds.top - otherBounds.bottom) < GAP_THRESHOLD) {
              topNeighbors.push({ panel: otherPanel, bounds: otherBounds });
            }
          }
        }
      });

      // Create vertical resize indicators
      if (rightNeighbors.length > 0) {
        const x = (mainBounds.right + Math.min(...rightNeighbors.map(n => n.bounds.left))) / 2;
        gaps.push({
          x1: x,
          y1: mainBounds.top,
          x2: x,
          y2: mainBounds.bottom,
          isVertical: true
        });
      }

      if (leftNeighbors.length > 0) {
        const x = (mainBounds.left + Math.max(...leftNeighbors.map(n => n.bounds.right))) / 2;
        gaps.push({
          x1: x,
          y1: mainBounds.top,
          x2: x,
          y2: mainBounds.bottom,
          isVertical: true
        });
      }

      // Create horizontal resize indicators
      if (bottomNeighbors.length > 0) {
        const y = (mainBounds.bottom + Math.min(...bottomNeighbors.map(n => n.bounds.top))) / 2;
        gaps.push({
          x1: mainBounds.left,
          y1: y,
          x2: mainBounds.right,
          y2: y,
          isVertical: false
        });
      }

      if (topNeighbors.length > 0) {
        const y = (mainBounds.top + Math.max(...topNeighbors.map(n => n.bounds.bottom))) / 2;
        gaps.push({
          x1: mainBounds.left,
          y1: y,
          x2: mainBounds.right,
          y2: y,
          isVertical: false
        });
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
