import { rotatePanels, mirrorPanels, fullPageLayout, widePageLayout, threePanelsLayout } from './layouts';
import { Panel } from '../types/comic';
import { PAGE_WIDTH, PAGE_HEIGHT, PAGE_MARGIN } from './consts';

const comparePanels = (panels1: Panel[], panels2: Panel[]) => {
  expect(panels1.length).toBe(panels2.length);
  for (let i = 0; i < panels1.length; i++) {
    expect(panels1[i].points).toEqual(panels2[i].points);
  }
};

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
    it('should rotate a full page layout', () => {
      const panels = fullPageLayout();
      const rotated = rotatePanels(panels);

      // Full page layout is a single panel with margins
      expect(rotated[0].points).toEqual([
        [PAGE_MARGIN, PAGE_HEIGHT-PAGE_MARGIN],
        [PAGE_MARGIN, PAGE_MARGIN],
        [PAGE_WIDTH - PAGE_MARGIN, PAGE_MARGIN],
        [PAGE_WIDTH - PAGE_MARGIN, PAGE_HEIGHT - PAGE_MARGIN]
      ]);

      // Verify that after 3 more rotations the panel is back to its original position
      const rotated3 = rotatePanels(rotatePanels(rotatePanels(rotated)));
      comparePanels(rotated3, panels);
    });

    it('should rotate a wide page layout', () => {
      const panels = widePageLayout();
      
      const rotated = rotatePanels(panels);

      // When wide panel gets rotated it just becomes a full page layout, this might change in the future because it doesn't really make sense
      // but we'll leave it for now
      expect(rotated[0].points).toEqual([
        [PAGE_MARGIN, PAGE_HEIGHT-PAGE_MARGIN],
        [PAGE_MARGIN, PAGE_MARGIN],
        [PAGE_WIDTH - PAGE_MARGIN, PAGE_MARGIN],
        [PAGE_WIDTH - PAGE_MARGIN, PAGE_HEIGHT - PAGE_MARGIN]
      ]);

      // Verify that after 3 more rotations the panel is back to its original position
      const rotated3 = rotatePanels(rotatePanels(rotatePanels(rotated)));
      comparePanels(rotated3, fullPageLayout());
    });
  });
}); 