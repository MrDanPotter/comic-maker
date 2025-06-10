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

/**
 * Checks if a polygon is rectangular by verifying:
 * 1. It has exactly 4 points
 * 2. All angles are 90 degrees (using dot product)
 * 3. Opposite sides are parallel and equal length
 */
export function isRectangular(points: [number, number][]): boolean {
  // Must have exactly 4 points
  if (points.length !== 4) return false;

  // Helper function to calculate vector between two points
  const getVector = (p1: [number, number], p2: [number, number]): [number, number] => [
    p2[0] - p1[0],
    p2[1] - p1[1]
  ];

  // Helper function to calculate dot product of two vectors
  const dotProduct = (v1: [number, number], v2: [number, number]): number =>
    v1[0] * v2[0] + v1[1] * v2[1];

  // Helper function to calculate vector length squared
  const lengthSquared = (v: [number, number]): number =>
    v[0] * v[0] + v[1] * v[1];

  // Get vectors for all sides
  const vectors = [
    getVector(points[0], points[1]),
    getVector(points[1], points[2]),
    getVector(points[2], points[3]),
    getVector(points[3], points[0])
  ];

  // Check all angles are 90 degrees (dot product should be 0)
  // and opposite sides are parallel and equal length
  for (let i = 0; i < 4; i++) {
    const nextIndex = (i + 1) % 4;
    const oppositeIndex = (i + 2) % 4;

    // Check angle is 90 degrees (dot product should be 0)
    const dot = dotProduct(vectors[i], vectors[nextIndex]);
    if (Math.abs(dot) > 0.0001) return false;

    // Check opposite sides are equal length
    const len1 = lengthSquared(vectors[i]);
    const len2 = lengthSquared(vectors[oppositeIndex]);
    if (Math.abs(len1 - len2) > 0.0001) return false;
  }

  return true;
} 