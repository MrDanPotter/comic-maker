import { Panel } from '../types/comic';
import { getBoundingBox } from './polygonUtils';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a panel with automatic bounding box
function createPanel(points: [number, number][]): Panel {
  return {
    id: uuidv4(),
    shape: 'polygon',
    points,
    dropZone: getBoundingBox(points)
  };
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

// 2x3 grid layout (2 rows, 3 columns)
export const twoByThreeLayout = (): Panel[] => {
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

// Left tall, right squares layout
export const leftTallRightSquaresLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const leftPanelWidth = (availableWidth - gap) / 2;
  const rightPanelWidth = leftPanelWidth;
  const rightPanelHeight = (availableHeight - gap) / 2;
  
  return [
    // Left tall panel
    createPanel([
      [margin, margin],
      [margin + leftPanelWidth, margin],
      [margin + leftPanelWidth, margin + availableHeight],
      [margin, margin + availableHeight]
    ]),
    // Top right square
    createPanel([
      [margin + leftPanelWidth + gap, margin],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin + rightPanelHeight],
      [margin + leftPanelWidth + gap, margin + rightPanelHeight]
    ]),
    // Bottom right square
    createPanel([
      [margin + leftPanelWidth + gap, margin + rightPanelHeight + gap],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin + rightPanelHeight + gap],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin + rightPanelHeight * 2 + gap],
      [margin + leftPanelWidth + gap, margin + rightPanelHeight * 2 + gap]
    ])
  ];
};

// Right tall, left squares layout
export const rightTallLeftSquaresLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const rightPanelWidth = (availableWidth - gap) / 2;
  const leftPanelWidth = rightPanelWidth;
  const leftPanelHeight = (availableHeight - gap) / 2;
  
  return [
    // Right tall panel
    createPanel([
      [margin + leftPanelWidth + gap, margin],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin],
      [margin + leftPanelWidth + gap + rightPanelWidth, margin + availableHeight],
      [margin + leftPanelWidth + gap, margin + availableHeight]
    ]),
    // Top left square
    createPanel([
      [margin, margin],
      [margin + leftPanelWidth, margin],
      [margin + leftPanelWidth, margin + leftPanelHeight],
      [margin, margin + leftPanelHeight]
    ]),
    // Bottom left square
    createPanel([
      [margin, margin + leftPanelHeight + gap],
      [margin + leftPanelWidth, margin + leftPanelHeight + gap],
      [margin + leftPanelWidth, margin + leftPanelHeight * 2 + gap],
      [margin, margin + leftPanelHeight * 2 + gap]
    ])
  ];
};

// Top tall, bottom squares layout
export const topTallBottomSquaresLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const topPanelHeight = (availableHeight - gap) / 2;
  const bottomPanelHeight = topPanelHeight;
  const bottomPanelWidth = (availableWidth - gap) / 2;
  
  return [
    // Top tall panel
    createPanel([
      [margin, margin],
      [margin + availableWidth, margin],
      [margin + availableWidth, margin + topPanelHeight],
      [margin, margin + topPanelHeight]
    ]),
    // Bottom left square
    createPanel([
      [margin, margin + topPanelHeight + gap],
      [margin + bottomPanelWidth, margin + topPanelHeight + gap],
      [margin + bottomPanelWidth, margin + topPanelHeight + gap + bottomPanelHeight],
      [margin, margin + topPanelHeight + gap + bottomPanelHeight]
    ]),
    // Bottom right square
    createPanel([
      [margin + bottomPanelWidth + gap, margin + topPanelHeight + gap],
      [margin + bottomPanelWidth * 2 + gap, margin + topPanelHeight + gap],
      [margin + bottomPanelWidth * 2 + gap, margin + topPanelHeight + gap + bottomPanelHeight],
      [margin + bottomPanelWidth + gap, margin + topPanelHeight + gap + bottomPanelHeight]
    ])
  ];
};

// Bottom tall, top squares layout
export const bottomTallTopSquaresLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const bottomPanelHeight = (availableHeight - gap) / 2;
  const topPanelHeight = bottomPanelHeight;
  const topPanelWidth = (availableWidth - gap) / 2;
  
  return [
    // Bottom tall panel
    createPanel([
      [margin, margin + topPanelHeight + gap],
      [margin + availableWidth, margin + topPanelHeight + gap],
      [margin + availableWidth, margin + topPanelHeight + gap + bottomPanelHeight],
      [margin, margin + topPanelHeight + gap + bottomPanelHeight]
    ]),
    // Top left square
    createPanel([
      [margin, margin],
      [margin + topPanelWidth, margin],
      [margin + topPanelWidth, margin + topPanelHeight],
      [margin, margin + topPanelHeight]
    ]),
    // Top right square
    createPanel([
      [margin + topPanelWidth + gap, margin],
      [margin + topPanelWidth * 2 + gap, margin],
      [margin + topPanelWidth * 2 + gap, margin + topPanelHeight],
      [margin + topPanelWidth + gap, margin + topPanelHeight]
    ])
  ];
};

// Three vertical panels stacked
export const threeVerticalPanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelHeight = (availableHeight - (2 * gap)) / 3;
  
  return [
    // Top panel
    createPanel([
      [margin, margin],
      [margin + availableWidth, margin],
      [margin + availableWidth, margin + panelHeight],
      [margin, margin + panelHeight]
    ]),
    // Middle panel
    createPanel([
      [margin, margin + panelHeight + gap],
      [margin + availableWidth, margin + panelHeight + gap],
      [margin + availableWidth, margin + panelHeight * 2 + gap],
      [margin, margin + panelHeight * 2 + gap]
    ]),
    // Bottom panel
    createPanel([
      [margin, margin + panelHeight * 2 + gap * 2],
      [margin + availableWidth, margin + panelHeight * 2 + gap * 2],
      [margin + availableWidth, margin + panelHeight * 3 + gap * 2],
      [margin, margin + panelHeight * 3 + gap * 2]
    ])
  ];
};

// Three horizontal panels side by side
export const threeHorizontalPanelsLayout = (): Panel[] => {
  const margin = 20;
  const gap = 15;
  const availableWidth = 800 - (2 * margin);
  const availableHeight = 1000 - (2 * margin);
  const panelWidth = (availableWidth - (2 * gap)) / 3;
  
  return [
    // Left panel
    createPanel([
      [margin, margin],
      [margin + panelWidth, margin],
      [margin + panelWidth, margin + availableHeight],
      [margin, margin + availableHeight]
    ]),
    // Middle panel
    createPanel([
      [margin + panelWidth + gap, margin],
      [margin + panelWidth * 2 + gap, margin],
      [margin + panelWidth * 2 + gap, margin + availableHeight],
      [margin + panelWidth + gap, margin + availableHeight]
    ]),
    // Right panel
    createPanel([
      [margin + panelWidth * 2 + gap * 2, margin],
      [margin + panelWidth * 3 + gap * 2, margin],
      [margin + panelWidth * 3 + gap * 2, margin + availableHeight],
      [margin + panelWidth * 2 + gap * 2, margin + availableHeight]
    ])
  ];
};

// Single centered square panel
export const singleSquareLayout = (): Panel[] => {
  const margin = 200; // 200px margin on all sides
  const size = 600; // 600x600 square
  const x = margin;
  const y = margin;
  
  return [
    createPanel([
      [x, y],
      [x + size, y],
      [x + size, y + size],
      [x, y + size]
    ])
  ];
};

// Classic 3x3 grid layout
export const threeByThreeLayout = (): Panel[] => {
  const panelWidth = 240;
  const panelHeight = 300;
  const gap = 20;
  
  return Array(9).fill(null).map((_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = col * (panelWidth + gap) + 20;
    const y = row * (panelHeight + gap) + 20;
    
    return createPanel([
      [x, y],
      [x + panelWidth, y],
      [x + panelWidth, y + panelHeight],
      [x, y + panelHeight]
    ]);
  });
};

// Dynamic diagonal layout
export const diagonalLayout = (): Panel[] => {
  return [
    // Top panel
    createPanel([
      [20, 20],
      [760, 20],
      [520, 300],
      [260, 300]
    ]),
    // Middle panel
    createPanel([
      [260, 300],
      [520, 300],
      [640, 500],
      [140, 500]
    ]),
    // Bottom panel
    createPanel([
      [140, 500],
      [640, 500],
      [760, 960],
      [20, 960]
    ])
  ];
};

// Radial layout
export const radialLayout = (): Panel[] => {
  const centerX = 400;
  const centerY = 500;
  const radius = 400;
  
  const panels: Panel[] = [];
  const segments = 6;
  
  for (let i = 0; i < segments; i++) {
    const startAngle = (i * 2 * Math.PI) / segments;
    const endAngle = ((i + 1) * 2 * Math.PI) / segments;
    
    const points: [number, number][] = [
      [centerX, centerY],
      [
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle)
      ],
      [
        centerX + radius * Math.cos((startAngle + endAngle) / 2),
        centerY + radius * Math.sin((startAngle + endAngle) / 2)
      ],
      [
        centerX + radius * Math.cos(endAngle),
        centerY + radius * Math.sin(endAngle)
      ]
    ];
    
    panels.push(createPanel(points));
  }
  
  return panels;
};

// Manga-style dynamic layout
export const mangaLayout = (): Panel[] => {
  return [
    // Large establishing shot
    createPanel([
      [20, 20],
      [760, 20],
      [760, 400],
      [20, 400]
    ]),
    // Dynamic diagonal panels
    createPanel([
      [20, 400],
      [380, 400],
      [280, 700],
      [20, 700]
    ]),
    createPanel([
      [380, 400],
      [760, 400],
      [760, 700],
      [280, 700]
    ]),
    // Bottom action panel
    createPanel([
      [20, 700],
      [760, 700],
      [760, 960],
      [20, 960]
    ])
  ];
}; 