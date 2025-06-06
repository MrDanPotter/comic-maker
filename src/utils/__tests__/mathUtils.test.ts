import {
  calculateAspectRatio,
  calculateImageScale,
  calculateMaxOffset,
  constrainPosition
} from '../mathUtils';

describe('mathUtils', () => {
  describe('calculateAspectRatio', () => {
    it('should calculate correct aspect ratio for landscape dimensions', () => {
      const dimensions = { width: 1600, height: 900 };
      expect(calculateAspectRatio(dimensions)).toBe(1600/900);
    });

    it('should calculate correct aspect ratio for portrait dimensions', () => {
      const dimensions = { width: 900, height: 1600 };
      expect(calculateAspectRatio(dimensions)).toBe(900/1600);
    });

    it('should calculate correct aspect ratio for square dimensions', () => {
      const dimensions = { width: 1000, height: 1000 };
      expect(calculateAspectRatio(dimensions)).toBe(1);
    });
  });

  describe('calculateImageScale', () => {
    describe('when image is wider than container (landscape)', () => {
      const containerDimensions = { width: 800, height: 600 };

      it('should scale based on height for wider aspect ratio to ensure full coverage', () => {
        const imageDimensions = { width: 1600, height: 900 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        expect(scale).toBe(600/900); // Should match container height
      });

      it('should ensure image width exceeds container width', () => {
        const imageDimensions = { width: 1600, height: 900 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        const scaledWidth = imageDimensions.width * scale;
        expect(scaledWidth).toBeGreaterThan(containerDimensions.width);
      });
    });

    describe('when image is taller than container (portrait)', () => {
      const containerDimensions = { width: 800, height: 600 };

      it('should scale based on width for taller aspect ratio to ensure full coverage', () => {
        const imageDimensions = { width: 900, height: 1600 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        expect(scale).toBe(800/900); // Should match container width
      });

      it('should ensure image height exceeds container height', () => {
        const imageDimensions = { width: 900, height: 1600 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        const scaledHeight = imageDimensions.height * scale;
        expect(scaledHeight).toBeGreaterThan(containerDimensions.height);
      });
    });

    describe('edge cases', () => {
      it('should handle square container with rectangular image', () => {
        const containerDimensions = { width: 1000, height: 1000 };
        const imageDimensions = { width: 1600, height: 900 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        expect(scale).toBe(1000/900); // Match height to ensure full width coverage
      });

      it('should handle square image with rectangular container', () => {
        const containerDimensions = { width: 800, height: 600 };
        const imageDimensions = { width: 1000, height: 1000 };
        const scale = calculateImageScale(containerDimensions, imageDimensions);
        expect(scale).toBe(800/1000); // Match width to ensure full height coverage
      });
    });
  });

  describe('calculateMaxOffset', () => {
    const containerDimensions = { width: 800, height: 600 };
    const imageDimensions = { width: 1600, height: 900 };
    const scale = 600/900; // Scale based on container height

    it('should calculate correct horizontal offset', () => {
      const maxOffset = calculateMaxOffset(containerDimensions, imageDimensions, scale);
      // Scaled image is (1600 * 600/900)=1066.67 x 600
      // Horizontal offset should be (1066.67 - 800) / 2 = 133.33
      expect(maxOffset.x).toBeCloseTo(133.33, 1);
    });

    it('should calculate correct vertical offset', () => {
      const maxOffset = calculateMaxOffset(containerDimensions, imageDimensions, scale);
      // Scaled image is 1066.67x600, container is 800x600
      // No vertical offset as heights match
      expect(maxOffset.y).toBe(0);
    });

    it('should handle larger scaled dimensions', () => {
      const largerScale = 2; // Will result in 3200x1800 scaled image
      const maxOffset = calculateMaxOffset(containerDimensions, imageDimensions, largerScale);
      expect(maxOffset.x).toBe(1200); // (3200 - 800) / 2
      expect(maxOffset.y).toBe(600); // (1800 - 600) / 2
    });
  });

  describe('constrainPosition', () => {
    const maxOffset = { x: 100, y: 50 };

    it('should not modify position within bounds', () => {
      const position = { x: 50, y: 25 };
      const constrained = constrainPosition(position, maxOffset);
      expect(constrained).toEqual(position);
    });

    it('should constrain position exceeding positive bounds', () => {
      const position = { x: 150, y: 75 };
      const constrained = constrainPosition(position, maxOffset);
      expect(constrained).toEqual({ x: 100, y: 50 });
    });

    it('should constrain position exceeding negative bounds', () => {
      const position = { x: -150, y: -75 };
      const constrained = constrainPosition(position, maxOffset);
      expect(constrained).toEqual({ x: -100, y: -50 });
    });

    it('should handle zero maxOffset', () => {
      const position = { x: 50, y: 25 };
      const constrained = constrainPosition(position, { x: 0, y: 0 });
      expect(constrained).toEqual({ x: 0, y: 0 });
    });

    it('should handle asymmetric constraints', () => {
      const position = { x: 200, y: -30 };
      const asymmetricMaxOffset = { x: 150, y: 25 };
      const constrained = constrainPosition(position, asymmetricMaxOffset);
      expect(constrained).toEqual({ x: 150, y: -25 });
    });
  });
}); 