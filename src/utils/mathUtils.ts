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
export const calculateImageScale = (
  containerDimensions: Dimensions,
  imageDimensions: Dimensions
): number => {
  const containerAspect = calculateAspectRatio(containerDimensions);
  const imageAspect = calculateAspectRatio(imageDimensions);

  if (imageAspect > containerAspect) {
    // Image is wider than container
    // Match image height to container height to ensure full width coverage
    return containerDimensions.height / imageDimensions.height;
  } else {
    // Image is taller than container
    // Match image width to container width to ensure full height coverage
    return containerDimensions.width / imageDimensions.width;
  }
};

/**
 * Calculates the maximum allowed offset for dragging based on
 * the scaled image dimensions and container size
 */
export const calculateMaxOffset = (
  containerDimensions: Dimensions,
  imageDimensions: Dimensions,
  scale: number
): Position => {
  const scaledWidth = imageDimensions.width * scale;
  const scaledHeight = imageDimensions.height * scale;

  return {
    x: (scaledWidth - containerDimensions.width) / 2,
    y: (scaledHeight - containerDimensions.height) / 2
  };
};

/**
 * Constrains a position within the given bounds
 */
export const constrainPosition = (
  position: Position,
  maxOffset: Position
): Position => {
  return {
    x: Math.max(-maxOffset.x, Math.min(maxOffset.x, position.x)),
    y: Math.max(-maxOffset.y, Math.min(maxOffset.y, position.y))
  };
}; 