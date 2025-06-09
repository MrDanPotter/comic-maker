import { rotatePanels, mirrorPanels } from './layouts';
import { Panel } from '../types/comic';

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
    const PAGE_WIDTH = 800;
    const PAGE_HEIGHT = 1000;
    const PAGE_MARGIN = 20;

    it('should rotate a single panel 90 degrees clockwise', () => {
      const panel = createRectPanel(20, 20, 100, 180);  // Tall panel
      const rotated = rotatePanels([panel]);

      // After rotation:
      // 1. Panel should be within page margins
      // 2. Panel should maintain aspect ratio (but flipped)
      const getSize = (points: [number, number][]) => {
        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        return {
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys)
        };
      };

      const originalSize = getSize(panel.points);
      const rotatedSize = getSize(rotated[0].points);
      
      // Check that panel is within page margins
      expect(rotatedSize.minX).toBeGreaterThanOrEqual(PAGE_MARGIN);
      expect(rotatedSize.maxX).toBeLessThanOrEqual(PAGE_WIDTH - PAGE_MARGIN);
      expect(rotatedSize.minY).toBeGreaterThanOrEqual(PAGE_MARGIN);
      expect(rotatedSize.maxY).toBeLessThanOrEqual(PAGE_HEIGHT - PAGE_MARGIN);

      // Check that aspect ratio is maintained (but flipped)
      const originalRatio = originalSize.width / originalSize.height;
      const rotatedRatio = rotatedSize.height / rotatedSize.width;
      expect(Math.abs(originalRatio - rotatedRatio)).toBeLessThan(0.1);
    });

    it('should maintain relative positions after rotation', () => {
      const panels = [
        createRectPanel(20, 20, 60, 180),    // Tall left panel
        createRectPanel(80, 20, 120, 90),    // Short top-right panel
        createRectPanel(80, 110, 120, 180),  // Short bottom-right panel
      ];
      const rotated = rotatePanels(panels);

      // After rotation, all panels should be within page margins
      rotated.forEach(panel => {
        const xs = panel.points.map(p => p[0]);
        const ys = panel.points.map(p => p[1]);
        
        expect(Math.min(...xs)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...xs)).toBeLessThanOrEqual(PAGE_WIDTH - PAGE_MARGIN);
        expect(Math.min(...ys)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...ys)).toBeLessThanOrEqual(PAGE_HEIGHT - PAGE_MARGIN);
      });

      // Verify panels don't overlap in Y direction
      const getYBounds = (points: [number, number][]) => {
        const ys = points.map(p => p[1]);
        return {
          minY: Math.min(...ys),
          maxY: Math.max(...ys)
        };
      };

      const yBounds = rotated.map(panel => getYBounds(panel.points));
      for (let i = 0; i < yBounds.length - 1; i++) {
        for (let j = i + 1; j < yBounds.length; j++) {
          // Either panel i is completely above panel j, or panel j is completely above panel i
          const noOverlap = 
            yBounds[i].maxY <= yBounds[j].minY ||
            yBounds[j].maxY <= yBounds[i].minY;
          expect(noOverlap).toBe(true);
        }
      }
    });

    it('should preserve aspect ratios of panel groups', () => {
      const panels = [
        createRectPanel(20, 20, 120, 60),   // Wide top panel
        createRectPanel(20, 80, 60, 180),   // Bottom-left panel
        createRectPanel(80, 80, 120, 180),  // Bottom-right panel
      ];
      const rotated = rotatePanels(panels);

      // After rotation, all panels should be within page margins
      rotated.forEach(panel => {
        const xs = panel.points.map(p => p[0]);
        const ys = panel.points.map(p => p[1]);
        
        expect(Math.min(...xs)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...xs)).toBeLessThanOrEqual(PAGE_WIDTH - PAGE_MARGIN);
        expect(Math.min(...ys)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...ys)).toBeLessThanOrEqual(PAGE_HEIGHT - PAGE_MARGIN);
      });

      // Verify that the overall layout maintains a reasonable aspect ratio
      const getBounds = (panels: Panel[]) => {
        const allPoints = panels.flatMap(p => p.points);
        const xs = allPoints.map(p => p[0]);
        const ys = allPoints.map(p => p[1]);
        return {
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys)
        };
      };

      const originalBounds = getBounds(panels);
      const rotatedBounds = getBounds(rotated);

      // The rotated layout should have a width/height ratio similar to
      // the original height/width ratio
      const originalRatio = originalBounds.width / originalBounds.height;
      const rotatedRatio = rotatedBounds.height / rotatedBounds.width;
      expect(Math.abs(originalRatio - rotatedRatio)).toBeLessThan(0.1);
    });

    it('should handle square panels correctly', () => {
      const panels = [
        createRectPanel(20, 20, 100, 100),    // Square panel
        createRectPanel(120, 20, 200, 100),   // Another square panel
      ];
      const rotated = rotatePanels(panels);

      // After rotation, panels should be within page margins
      rotated.forEach(panel => {
        const xs = panel.points.map(p => p[0]);
        const ys = panel.points.map(p => p[1]);
        
        expect(Math.min(...xs)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...xs)).toBeLessThanOrEqual(PAGE_WIDTH - PAGE_MARGIN);
        expect(Math.min(...ys)).toBeGreaterThanOrEqual(PAGE_MARGIN);
        expect(Math.max(...ys)).toBeLessThanOrEqual(PAGE_HEIGHT - PAGE_MARGIN);
      });

      // For square panels, verify they remain approximately square
      rotated.forEach(panel => {
        const xs = panel.points.map(p => p[0]);
        const ys = panel.points.map(p => p[1]);
        const width = Math.max(...xs) - Math.min(...xs);
        const height = Math.max(...ys) - Math.min(...ys);
        
        // Allow for some scaling differences due to page constraints
        expect(Math.abs(width / height - 1)).toBeLessThan(0.2);
      });
    });
  });
}); 