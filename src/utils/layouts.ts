import { Panel } from '../types/comic';
import { getBoundingBox } from './polygonUtils';
import { v4 as uuidv4 } from 'uuid';

// Constants for page dimensions
const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 1000;
const PAGE_MARGIN = 20;

// Helper function to create a panel with automatic bounding box
function createPanel(points: [number, number][]): Panel {
  return {
    id: uuidv4(),
    shape: 'polygon',
    points,
    dropZone: getBoundingBox(points)
  };
}

// Helper function to get the bounding box of a panel from its points
function getPanelBounds(points: [number, number][]) {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys)
  };
}

// Rotate a panel's points 90 degrees clockwise while maintaining aspect ratio
export function rotatePanels(panels: Panel[]): Panel[] {
  // First, get the overall bounds of all panels
  const bounds = panels.reduce((acc, panel) => {
    const panelBounds = getPanelBounds(panel.points);
    return {
      left: Math.min(acc.left, panelBounds.left),
      right: Math.max(acc.right, panelBounds.right),
      top: Math.min(acc.top, panelBounds.top),
      bottom: Math.max(acc.bottom, panelBounds.bottom)
    };
  }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

  const originalWidth = bounds.right - bounds.left;
  const originalHeight = bounds.bottom - bounds.top;

  // Calculate the scale factors to maintain aspect ratio after rotation
  const availableWidth = PAGE_WIDTH - (2 * PAGE_MARGIN);
  const availableHeight = PAGE_HEIGHT - (2 * PAGE_MARGIN);
  
  const scaleX = availableWidth / originalHeight;
  const scaleY = availableHeight / originalWidth;

  return panels.map(panel => {
    // Rotate each point 90 degrees clockwise around the center and scale to maintain aspect ratio
    const newPoints = panel.points.map(([x, y]) => {
      // Translate to origin
      const relX = x - bounds.left;
      const relY = y - bounds.top;

      // Rotate 90 degrees clockwise: (x, y) -> (y, -x)
      const rotX = relY;
      const rotY = -relX;

      // Scale and translate back
      return [
        PAGE_MARGIN + (rotX * scaleX),
        PAGE_MARGIN + ((rotY + originalWidth) * scaleY)
      ] as [number, number];
    });

    return {
      ...panel,
      points: newPoints,
      dropZone: getBoundingBox(newPoints)
    };
  });
}

// Mirror panels horizontally (along Y axis)
export function mirrorPanels(panels: Panel[]): Panel[] {
  // Get the overall bounds
  const bounds = panels.reduce((acc, panel) => {
    const panelBounds = getPanelBounds(panel.points);
    return {
      left: Math.min(acc.left, panelBounds.left),
      right: Math.max(acc.right, panelBounds.right),
      top: Math.min(acc.top, panelBounds.top),
      bottom: Math.max(acc.bottom, panelBounds.bottom)
    };
  }, { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity });

  return panels.map(panel => {
    // Mirror each point across the vertical centerline
    const newPoints = panel.points.map(([x, y]) => {
      const distanceFromLeft = x - bounds.left;
      const distanceFromRight = bounds.right - x;
      return [bounds.left + distanceFromRight, y] as [number, number];
    });

    return {
      ...panel,
      points: newPoints,
      dropZone: getBoundingBox(newPoints)
    };
  });
}

// Full page panel with margins
export const fullPageLayout = (): Panel[] => {
  const margin = 20; // 20px margin on all sides
  return [
    createPanel([
      [margin, margin],
      [800 - margin, margin],
      [800 - margin, 1000 - margin],
      [margin, 1000 - margin]
    ])
  ];
};

// Wide page panel (5:4 aspect ratio)
export const widePageLayout = (): Panel[] => {
  const margin = 20; // 20px margin on all sides
  const availableWidth = 800 - (2 * margin);
  // If width is 760 (availableWidth) and aspect ratio is 5:4,
  // then height should be (760 * 4/5) = 608
  const panelHeight = Math.floor(availableWidth * 4/5);
  const pageCenter = 1000 / 2;
  const startY = pageCenter - (panelHeight / 2); // Center the panel vertically
  
  return [
    createPanel([
      [margin, startY],
      [margin + availableWidth, startY],
      [margin + availableWidth, startY + panelHeight],
      [margin, startY + panelHeight]
    ])
  ];
};

// 6 panels (2x3 grid)
export const sixPanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelWidth = (availableWidth - (2 * gap)) / 3;
  const panelHeight = (availableHeight - gap) / 2;
  
  const panels: Panel[] = [];
  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = margin + (col * (panelWidth + gap));
      const y = margin + (row * (panelHeight + gap));
      
      panels.push(createPanel([
        [x, y],
        [x + panelWidth, y],
        [x + panelWidth, y + panelHeight],
        [x, y + panelHeight]
      ]));
    }
  }
  
  return panels;
};

// 4 panels (2x2 grid)
export const fourPanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelWidth = (availableWidth - gap) / 2;
  const panelHeight = (availableHeight - gap) / 2;
  
  const panels: Panel[] = [];
  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const x = margin + (col * (panelWidth + gap));
      const y = margin + (row * (panelHeight + gap));
      
      panels.push(createPanel([
        [x, y],
        [x + panelWidth, y],
        [x + panelWidth, y + panelHeight],
        [x, y + panelHeight]
      ]));
    }
  }
  
  return panels;
};

// 1 Big 2 Small layout
export const oneBigTwoSmallLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  
  const leftWidth = (availableWidth - gap) * 0.5; // 50% of available width
  const rightWidth = availableWidth - leftWidth - gap;
  const rightPanelHeight = (availableHeight - gap) / 2;
  
  return [
    // Left tall panel
    createPanel([
      [margin, margin],
      [margin + leftWidth, margin],
      [margin + leftWidth, margin + availableHeight],
      [margin, margin + availableHeight]
    ]),
    // Top right panel
    createPanel([
      [margin + leftWidth + gap, margin],
      [margin + availableWidth, margin],
      [margin + availableWidth, margin + rightPanelHeight],
      [margin + leftWidth + gap, margin + rightPanelHeight]
    ]),
    // Bottom right panel
    createPanel([
      [margin + leftWidth + gap, margin + rightPanelHeight + gap],
      [margin + availableWidth, margin + rightPanelHeight + gap],
      [margin + availableWidth, margin + availableHeight],
      [margin + leftWidth + gap, margin + availableHeight]
    ])
  ];
};

// 3 panels layout
export const threePanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelWidth = availableWidth;
  const panelHeight = (availableHeight - (2 * gap)) / 3;
  
  return [
    createPanel([
      [margin, margin],
      [margin + panelWidth, margin],
      [margin + panelWidth, margin + panelHeight],
      [margin, margin + panelHeight]
    ]),
    createPanel([
      [margin, margin + panelHeight + gap],
      [margin + panelWidth, margin + panelHeight + gap],
      [margin + panelWidth, margin + (2 * panelHeight) + gap],
      [margin, margin + (2 * panelHeight) + gap]
    ]),
    createPanel([
      [margin, margin + (2 * panelHeight) + (2 * gap)],
      [margin + panelWidth, margin + (2 * panelHeight) + (2 * gap)],
      [margin + panelWidth, margin + (3 * panelHeight) + (2 * gap)],
      [margin, margin + (3 * panelHeight) + (2 * gap)]
    ])
  ];
};

// 2 panels layout
export const twoPanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelWidth = availableWidth;
  const panelHeight = (availableHeight - gap) / 2;
  
  return [
    createPanel([
      [margin, margin],
      [margin + panelWidth, margin],
      [margin + panelWidth, margin + panelHeight],
      [margin, margin + panelHeight]
    ]),
    createPanel([
      [margin, margin + panelHeight + gap],
      [margin + panelWidth, margin + panelHeight + gap],
      [margin + panelWidth, margin + (2 * panelHeight) + gap],
      [margin, margin + (2 * panelHeight) + gap]
    ])
  ];
}; 