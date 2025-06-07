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