import { Panel } from '../types/comic';
import { getPanelBounds, findAdjacentPanels, processVerticalGaps, processHorizontalGaps, calculateResizeGaps } from './panelUtils';

describe('Panel Utilities', () => {
  describe('getPanelBounds', () => {
    it('should calculate correct bounds for a rectangular panel', () => {
      const panel: Panel = {
        id: '1',
        shape: 'polygon',
        points: [
          [0, 0],
          [100, 0],
          [100, 100],
          [0, 100]
        ],
        dropZone: { top: 0, left: 0, width: 100, height: 100 }
      };

      const bounds = getPanelBounds(panel);
      expect(bounds).toEqual({
        left: 0,
        right: 100,
        top: 0,
        bottom: 100
      });
    });

    it('should handle non-rectangular panels', () => {
      const panel: Panel = {
        id: '1',
        shape: 'polygon',
        points: [
          [0, 0],
          [100, 50],
          [50, 100],
          [0, 50]
        ],
        dropZone: { top: 0, left: 0, width: 100, height: 100 }
      };

      const bounds = getPanelBounds(panel);
      expect(bounds).toEqual({
        left: 0,
        right: 100,
        top: 0,
        bottom: 100
      });
    });
  });

  describe('findAdjacentPanels', () => {
    const basePanel: Panel = {
      id: '1',
      shape: 'polygon',
      points: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100]
      ],
      dropZone: { top: 0, left: 0, width: 100, height: 100 }
    };

    it('should find right adjacent panel', () => {
      const rightPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [110, 0],
          [210, 0],
          [210, 100],
          [110, 100]
        ],
        dropZone: { top: 0, left: 110, width: 100, height: 100 }
      };

      const neighbors = findAdjacentPanels(basePanel, [rightPanel], getPanelBounds, 20);
      expect(neighbors.rightNeighbors).toHaveLength(1);
      expect(neighbors.leftNeighbors).toHaveLength(0);
      expect(neighbors.bottomNeighbors).toHaveLength(0);
      expect(neighbors.topNeighbors).toHaveLength(0);
    });

    it('should find left adjacent panel', () => {
      const leftPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [-110, 0],
          [-10, 0],
          [-10, 100],
          [-110, 100]
        ],
        dropZone: { top: 0, left: -110, width: 100, height: 100 }
      };

      const neighbors = findAdjacentPanels(basePanel, [leftPanel], getPanelBounds, 20);
      expect(neighbors.rightNeighbors).toHaveLength(0);
      expect(neighbors.leftNeighbors).toHaveLength(1);
      expect(neighbors.bottomNeighbors).toHaveLength(0);
      expect(neighbors.topNeighbors).toHaveLength(0);
    });

    it('should find bottom adjacent panel', () => {
      const bottomPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [0, 110],
          [100, 110],
          [100, 210],
          [0, 210]
        ],
        dropZone: { top: 110, left: 0, width: 100, height: 100 }
      };

      const neighbors = findAdjacentPanels(basePanel, [bottomPanel], getPanelBounds, 20);
      expect(neighbors.rightNeighbors).toHaveLength(0);
      expect(neighbors.leftNeighbors).toHaveLength(0);
      expect(neighbors.bottomNeighbors).toHaveLength(1);
      expect(neighbors.topNeighbors).toHaveLength(0);
    });

    it('should find top adjacent panel', () => {
      const topPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [0, -110],
          [100, -110],
          [100, -10],
          [0, -10]
        ],
        dropZone: { top: -110, left: 0, width: 100, height: 100 }
      };

      const neighbors = findAdjacentPanels(basePanel, [topPanel], getPanelBounds, 20);
      expect(neighbors.rightNeighbors).toHaveLength(0);
      expect(neighbors.leftNeighbors).toHaveLength(0);
      expect(neighbors.bottomNeighbors).toHaveLength(0);
      expect(neighbors.topNeighbors).toHaveLength(1);
    });

    it('should not find non-adjacent panels', () => {
      const farPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [200, 200],
          [300, 200],
          [300, 300],
          [200, 300]
        ],
        dropZone: { top: 200, left: 200, width: 100, height: 100 }
      };

      const neighbors = findAdjacentPanels(basePanel, [farPanel], getPanelBounds, 20);
      expect(neighbors.rightNeighbors).toHaveLength(0);
      expect(neighbors.leftNeighbors).toHaveLength(0);
      expect(neighbors.bottomNeighbors).toHaveLength(0);
      expect(neighbors.topNeighbors).toHaveLength(0);
    });
  });

  describe('processVerticalGaps', () => {
    const basePanel: Panel = {
      id: '1',
      shape: 'polygon',
      points: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100]
      ],
      dropZone: { top: 0, left: 0, width: 100, height: 100 }
    };

    it('should process right gap correctly', () => {
      const rightPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [110, 0],
          [210, 0],
          [210, 100],
          [110, 100]
        ],
        dropZone: { top: 0, left: 110, width: 100, height: 100 }
      };

      const neighbors = {
        rightNeighbors: [rightPanel],
        leftNeighbors: []
      };

      const gaps = processVerticalGaps(basePanel, neighbors, getPanelBounds);
      expect(gaps).toHaveLength(1);
      expect(gaps[0]).toEqual({
        x1: 105,
        y1: 0,
        x2: 105,
        y2: 100,
        isVertical: true,
        panels: [
          { panel: basePanel, edge: 'right' },
          { panel: rightPanel, edge: 'left' }
        ]
      });
    });
  });

  describe('processHorizontalGaps', () => {
    const basePanel: Panel = {
      id: '1',
      shape: 'polygon',
      points: [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100]
      ],
      dropZone: { top: 0, left: 0, width: 100, height: 100 }
    };

    it('should process bottom gap correctly', () => {
      const bottomPanel: Panel = {
        id: '2',
        shape: 'polygon',
        points: [
          [0, 110],
          [100, 110],
          [100, 210],
          [0, 210]
        ],
        dropZone: { top: 110, left: 0, width: 100, height: 100 }
      };

      const neighbors = {
        bottomNeighbors: [bottomPanel],
        topNeighbors: []
      };

      const gaps = processHorizontalGaps(basePanel, neighbors, getPanelBounds);
      expect(gaps).toHaveLength(1);
      expect(gaps[0]).toEqual({
        x1: 0,
        y1: 105,
        x2: 100,
        y2: 105,
        isVertical: false,
        panels: [
          { panel: basePanel, edge: 'bottom' },
          { panel: bottomPanel, edge: 'top' }
        ]
      });
    });
  });

  describe('calculateResizeGaps', () => {
    it('should calculate gaps for a 2x2 grid', () => {
      const panels: Panel[] = [
        // Top left
        {
          id: '1',
          shape: 'polygon',
          points: [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100]
          ],
          dropZone: { top: 0, left: 0, width: 100, height: 100 }
        },
        // Top right
        {
          id: '2',
          shape: 'polygon',
          points: [
            [110, 0],
            [210, 0],
            [210, 100],
            [110, 100]
          ],
          dropZone: { top: 0, left: 110, width: 100, height: 100 }
        },
        // Bottom left
        {
          id: '3',
          shape: 'polygon',
          points: [
            [0, 110],
            [100, 110],
            [100, 210],
            [0, 210]
          ],
          dropZone: { top: 110, left: 0, width: 100, height: 100 }
        },
        // Bottom right
        {
          id: '4',
          shape: 'polygon',
          points: [
            [110, 110],
            [210, 110],
            [210, 210],
            [110, 210]
          ],
          dropZone: { top: 110, left: 110, width: 100, height: 100 }
        }
      ];

      const gaps = calculateResizeGaps(panels);
      expect(gaps).toHaveLength(4); // 2 vertical gaps + 2 horizontal gaps
      
      // Verify vertical gaps
      const verticalGaps = gaps.filter(gap => gap.isVertical);
      expect(verticalGaps).toHaveLength(2);
      
      // Verify horizontal gaps
      const horizontalGaps = gaps.filter(gap => !gap.isVertical);
      expect(horizontalGaps).toHaveLength(2);
    });

    it('should handle non-rectangular panels', () => {
      const panels: Panel[] = [
        {
          id: '1',
          shape: 'polygon',
          points: [
            [0, 0],
            [100, 50],
            [50, 100],
            [0, 50]
          ],
          dropZone: { top: 0, left: 0, width: 100, height: 100 }
        }
      ];

      const gaps = calculateResizeGaps(panels);
      expect(gaps).toHaveLength(0); // Non-rectangular panels should be skipped
    });

    it('should handle overlapping panels', () => {
      const panels: Panel[] = [
        {
          id: '1',
          shape: 'polygon',
          points: [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100]
          ],
          dropZone: { top: 0, left: 0, width: 100, height: 100 }
        },
        {
          id: '2',
          shape: 'polygon',
          points: [
            [50, 50],
            [150, 50],
            [150, 150],
            [50, 150]
          ],
          dropZone: { top: 50, left: 50, width: 100, height: 100 }
        }
      ];

      const gaps = calculateResizeGaps(panels);
      expect(gaps).toHaveLength(0); // Overlapping panels should not create gaps
    });
  });
}); 