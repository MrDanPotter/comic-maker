import { Panel } from '../types/comic';
import { isRectangular } from './mathUtils';

export interface PanelBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ResizeGap {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
  panels: Array<{
    panel: Panel;
    edge: 'left' | 'right' | 'top' | 'bottom';
  }>;
}

export const getPanelBounds = (panel: Panel): PanelBounds => ({
  left: Math.min(...panel.points.map(p => p[0])),
  right: Math.max(...panel.points.map(p => p[0])),
  top: Math.min(...panel.points.map(p => p[1])),
  bottom: Math.max(...panel.points.map(p => p[1]))
});

export const findAdjacentPanels = (
  panel: Panel,
  allPanels: Panel[],
  getBounds: (panel: Panel) => PanelBounds,
  GAP_THRESHOLD: number
) => {
  const bounds = getBounds(panel);
  
  // Find all panels that share a vertical border with panel
  const rightNeighbors = allPanels.filter(panel2 => {
    const bounds2 = getBounds(panel2);
    // Check if panels are close enough horizontally
    const isHorizontallyAdjacent = Math.abs(bounds.right - bounds2.left) < GAP_THRESHOLD;
    // Check if panels overlap vertically
    const verticalOverlap = Math.min(bounds.bottom, bounds2.bottom) - Math.max(bounds.top, bounds2.top);
    return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
  });

  const leftNeighbors = allPanels.filter(panel2 => {
    const bounds2 = getBounds(panel2);
    // Check if panels are close enough horizontally
    const isHorizontallyAdjacent = Math.abs(bounds.left - bounds2.right) < GAP_THRESHOLD;
    // Check if panels overlap vertically
    const verticalOverlap = Math.min(bounds.bottom, bounds2.bottom) - Math.max(bounds.top, bounds2.top);
    return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
  });

  // Find horizontal gaps (panels stacked)
  const bottomNeighbors = allPanels.filter(panel2 => {
    const bounds2 = getBounds(panel2);
    // Check if panels are close enough vertically
    const isVerticallyAdjacent = Math.abs(bounds.bottom - bounds2.top) < GAP_THRESHOLD;
    // Check if panels overlap horizontally
    const horizontalOverlap = Math.min(bounds.right, bounds2.right) - Math.max(bounds.left, bounds2.left);
    return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
  });

  const topNeighbors = allPanels.filter(panel2 => {
    const bounds2 = getBounds(panel2);
    // Check if panels are close enough vertically
    const isVerticallyAdjacent = Math.abs(bounds.top - bounds2.bottom) < GAP_THRESHOLD;
    // Check if panels overlap horizontally
    const horizontalOverlap = Math.min(bounds.right, bounds2.right) - Math.max(bounds.left, bounds2.left);
    return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
  });

  return {
    rightNeighbors,
    leftNeighbors,
    bottomNeighbors,
    topNeighbors
  };
};

export const processVerticalGaps = (
  panel: Panel,
  neighbors: { rightNeighbors: Panel[]; leftNeighbors: Panel[] },
  getBounds: (panel: Panel) => PanelBounds
): ResizeGap[] => {
  const gaps: ResizeGap[] = [];
  const bounds = getBounds(panel);

  // Process right neighbors
  if (neighbors.rightNeighbors.length > 0) {
    // Find the overlapping region for all panels
    const overlapTop = Math.max(
      bounds.top,
      ...neighbors.rightNeighbors.map(p => getBounds(p).top)
    );
    const overlapBottom = Math.min(
      bounds.bottom,
      ...neighbors.rightNeighbors.map(p => getBounds(p).bottom)
    );

    const x = (bounds.right + Math.min(...neighbors.rightNeighbors.map(p => getBounds(p).left))) / 2;

    gaps.push({
      x1: x,
      y1: overlapTop,
      x2: x,
      y2: overlapBottom,
      isVertical: true,
      panels: [
        { panel, edge: 'right' },
        ...neighbors.rightNeighbors.map(p => ({ panel: p, edge: 'left' as const }))
      ]
    });
  }

  // Process left neighbors
  if (neighbors.leftNeighbors.length > 0) {
    // Find the overlapping region for all panels
    const overlapTop = Math.max(
      bounds.top,
      ...neighbors.leftNeighbors.map(p => getBounds(p).top)
    );
    const overlapBottom = Math.min(
      bounds.bottom,
      ...neighbors.leftNeighbors.map(p => getBounds(p).bottom)
    );

    const x = (bounds.left + Math.max(...neighbors.leftNeighbors.map(p => getBounds(p).right))) / 2;

    gaps.push({
      x1: x,
      y1: overlapTop,
      x2: x,
      y2: overlapBottom,
      isVertical: true,
      panels: [
        { panel, edge: 'left' },
        ...neighbors.leftNeighbors.map(p => ({ panel: p, edge: 'right' as const }))
      ]
    });
  }

  return gaps;
};

export const processHorizontalGaps = (
  panel: Panel,
  neighbors: { bottomNeighbors: Panel[]; topNeighbors: Panel[] },
  getBounds: (panel: Panel) => PanelBounds
): ResizeGap[] => {
  const gaps: ResizeGap[] = [];
  const bounds = getBounds(panel);

  // Process bottom neighbors
  if (neighbors.bottomNeighbors.length > 0) {
    // Find the overlapping region for all panels
    const overlapLeft = Math.max(
      bounds.left,
      ...neighbors.bottomNeighbors.map(p => getBounds(p).left)
    );
    const overlapRight = Math.min(
      bounds.right,
      ...neighbors.bottomNeighbors.map(p => getBounds(p).right)
    );

    const y = (bounds.bottom + Math.min(...neighbors.bottomNeighbors.map(p => getBounds(p).top))) / 2;

    gaps.push({
      x1: overlapLeft,
      y1: y,
      x2: overlapRight,
      y2: y,
      isVertical: false,
      panels: [
        { panel, edge: 'bottom' },
        ...neighbors.bottomNeighbors.map(p => ({ panel: p, edge: 'top' as const }))
      ]
    });
  }

  // Process top neighbors
  if (neighbors.topNeighbors.length > 0) {
    // Find the overlapping region for all panels
    const overlapLeft = Math.max(
      bounds.left,
      ...neighbors.topNeighbors.map(p => getBounds(p).left)
    );
    const overlapRight = Math.min(
      bounds.right,
      ...neighbors.topNeighbors.map(p => getBounds(p).right)
    );

    const y = (bounds.top + Math.max(...neighbors.topNeighbors.map(p => getBounds(p).bottom))) / 2;

    gaps.push({
      x1: overlapLeft,
      y1: y,
      x2: overlapRight,
      y2: y,
      isVertical: false,
      panels: [
        { panel, edge: 'top' },
        ...neighbors.topNeighbors.map(p => ({ panel: p, edge: 'bottom' as const }))
      ]
    });
  }

  return gaps;
};

export const calculateResizeGaps = (panels: Panel[], GAP_THRESHOLD: number = 20): ResizeGap[] => {
  const gaps: ResizeGap[] = [];

  panels.forEach((panel, i) => {
    // Skip if the current panel is not rectangular
    if (!isRectangular(panel.points)) return;

    const neighbors = findAdjacentPanels(panel, panels.slice(i + 1), getPanelBounds, GAP_THRESHOLD);
    
    // Process vertical gaps
    gaps.push(...processVerticalGaps(panel, neighbors, getPanelBounds));
    
    // Process horizontal gaps
    gaps.push(...processHorizontalGaps(panel, neighbors, getPanelBounds));
  });

  return gaps;
}; 