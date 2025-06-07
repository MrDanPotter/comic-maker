interface Dimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

/**
 * Calculates the aspect ratio of a rectangle
 */
export const calculateAspectRatio = (dimensions: Dimensions): number => {
  return dimensions.width / dimensions.height;
};

/**
 * Calculates the scale factor needed to make the image's smallest dimension
 * match the panel's largest dimension, ensuring the image fills the panel completely
 */
export function calculateImageScale(container: Dimensions, image: Dimensions): number {
  const containerRatio = container.width / container.height;
  const imageRatio = image.width / image.height;

  if (containerRatio > imageRatio) {
    // Container is wider than image ratio - scale to height
    return container.height / image.height;
  } else {
    // Container is taller than image ratio - scale to width
    return container.width / image.width;
  }
}

/**
 * Calculates the maximum allowed offset for dragging based on
 * the scaled image dimensions and container size
 */
export function calculateMaxOffset(
  container: Dimensions,
  image: Dimensions,
  scale: number
): { x: number; y: number } {
  const scaledImage = {
    width: image.width * scale,
    height: image.height * scale
  };

  return {
    x: Math.max(0, (scaledImage.width - container.width) / 2),
    y: Math.max(0, (scaledImage.height - container.height) / 2)
  };
}

/**
 * Constrains a position within the given bounds
 */
export function constrainPosition(position: Position, maxOffset: Position): Position {
  return {
    x: Math.max(-maxOffset.x, Math.min(maxOffset.x, position.x)),
    y: Math.max(-maxOffset.y, Math.min(maxOffset.y, position.y))
  };
}

export function calculatePolygonArea(points: [number, number][]): number {
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  
  return Math.abs(area) / 2;
}

export function isPolygonClockwise(points: [number, number][]): boolean {
  let sum = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    sum += (points[j][0] - points[i][0]) * (points[j][1] + points[i][1]);
  }
  
  return sum > 0;
}

export function normalizePolygon(points: [number, number][]): [number, number][] {
  // Ensure polygon points are in clockwise order for SVG
  if (!isPolygonClockwise(points)) {
    return [...points].reverse();
  }
  return points;
} 