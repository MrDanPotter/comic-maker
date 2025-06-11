import { rotatePanels, mirrorPanels } from './layouts';
import { Panel } from '../types/comic';
import { PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN } from './consts';

describe('Panel Transformations', () => {
  // Helper function to create a simple rectangular panel
  const createRectPanel = (x1: number, y1: number, x2: number, y2: number): Panel => ({
    id: 'test-id',
    shape: 'polygon',
    points: [
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2]
    ],
    dropZone: { top: y1, left: x1, width: x2 - x1, height: y2 - y1 }
  });

  describe('mirrorPanels', () => {
    it('should mirror a single panel horizontally', () => {
      const panel = createRectPanel(20, 20, 100, 100);
      const mirrored = mirrorPanels([panel]);

      // Original width is 80 (100 - 20)
      // After mirroring, right edge should be at same distance from left margin
      expect(mirrored[0].points).toEqual([
        [100, 20],  // Top left becomes top right
        [20, 20],   // Top right becomes top left
        [20, 100],  // Bottom right becomes bottom left
        [100, 100]  // Bottom left becomes bottom right
      ]);
    });

    it('should mirror multiple panels while maintaining relative positions', () => {
      const panels = [
        createRectPanel(20, 20, 60, 100),    // Left panel
        createRectPanel(80, 20, 120, 100),   // Right panel
      ];
      const mirrored = mirrorPanels(panels);

      // Panels should swap positions while maintaining their dimensions
      expect(mirrored[0].points).toEqual([
        [120, 20],  // Original left panel moves to right
        [80, 20],
        [80, 100],
        [120, 100]
      ]);
      expect(mirrored[1].points).toEqual([
        [60, 20],   // Original right panel moves to left
        [20, 20],
        [20, 100],
        [60, 100]
      ]);
    });

    it('should preserve panel dimensions after mirroring', () => {
      const panel = createRectPanel(20, 20, 100, 100);
      const mirrored = mirrorPanels([panel]);

      // Calculate dimensions before and after
      const getSize = (points: [number, number][]) => {
        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        return {
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys)
        };
      };

      const originalSize = getSize(panel.points);
      const mirroredSize = getSize(mirrored[0].points);

      expect(mirroredSize.width).toBe(originalSize.width);
      expect(mirroredSize.height).toBe(originalSize.height);
    });

    it('should handle panels with unequal sizes', () => {
      const panels = [
        createRectPanel(20, 20, 60, 180),    // Tall left panel
        createRectPanel(80, 20, 120, 90),    // Short top-right panel
        createRectPanel(80, 110, 120, 180),  // Short bottom-right panel
      ];
      const mirrored = mirrorPanels(panels);

      // Verify the tall panel moves to the right and short panels to the left
      expect(mirrored[0].points[0][0]).toBeGreaterThan(mirrored[1].points[0][0]);
      expect(mirrored[1].points).toEqual(expect.arrayContaining([
        expect.arrayContaining([expect.any(Number), 20]) // Top panel stays at y=20
      ]));
      expect(mirrored[2].points).toEqual(expect.arrayContaining([
        expect.arrayContaining([expect.any(Number), 110]) // Bottom panel stays at y=110
      ]));
    });
  });

  describe('rotatePanels', () => {
    it('should rotate a single panel 90 degrees clockwise', () => {
      const panel = createRectPanel(20, 20, 100, 180);  // Original: 80x160 panel
      const rotated = rotatePanels([panel], PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN);

      // After 90-degree clockwise rotation:
      // - Original width (80) becomes height
      // - Original height (160) becomes width
      // - Panel should be positioned at page margin
      expect(rotated[0].points).toEqual([
        [20, 20],           // Top-left
        [180, 20],          // Top-right (original height becomes width)
        [180, 100],         // Bottom-right
        [20, 100]           // Bottom-left (original width becomes height)
      ]);
    });

    it('should maintain relative positions after rotation', () => {
      const panels = [
        createRectPanel(20, 20, 60, 180),     // Left panel: 40x160
        createRectPanel(80, 20, 120, 90),     // Top-right panel: 40x70
        createRectPanel(80, 110, 120, 180)    // Bottom-right panel: 40x70
      ];
      const rotated = rotatePanels(panels, PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN);

      // After rotation:
      // Panel 1 (originally left, tall panel)
      expect(rotated[0].points).toEqual([
        [20, 20],
        [180, 20],
        [180, 60],
        [20, 60]
      ]);

      // Panel 2 (originally top-right panel)
      expect(rotated[1].points).toEqual([
        [20, 80],
        [90, 80],
        [90, 120],
        [20, 120]
      ]);

      // Panel 3 (originally bottom-right panel)
      expect(rotated[2].points).toEqual([
        [110, 80],
        [180, 80],
        [180, 120],
        [110, 120]
      ]);
    });

    it('should use custom dimensions when provided', () => {
      const panel = createRectPanel(20, 20, 100, 180);  // Original: 80x160 panel
      const rotated = rotatePanels([panel], 400, 500, 10);  // Half size page with smaller margin

      // After rotation with custom dimensions:
      expect(rotated[0].points).toEqual([
        [10, 10],           // Top-left
        [90, 10],          // Top-right (scaled to fit smaller width)
        [90, 50],          // Bottom-right (scaled to fit smaller height)
        [10, 50]           // Bottom-left
      ]);
    });

    it('a rotation of a single centered panel should not change its coordinates', () => {
      const panelWidth = 100;
      const panelHeight = 100;
      const panelX = (PAGE_WIDTH - panelWidth) / 2;
      const panelY = (PAGE_HEIGHT - panelHeight) / 2;
      const panel = createRectPanel(panelX, panelY, panelX + panelWidth, panelY+panelHeight );  // Original: 80x160 panel
      const rotated = rotatePanels([panel], PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN);
      expect(rotated[0].points).toEqual(panel.points);
    });
  });
}); 