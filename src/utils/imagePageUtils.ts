import { RootState } from '../store/store';
import { selectImagePageNumbers, selectImagePageInfo } from '../store/slices/imageLibrarySlice';

/**
 * Get the page numbers where an image is used
 * @param state - The Redux store state
 * @param imageId - The ID of the image
 * @returns Array of page numbers (1-based) where the image is used
 */
export const getImagePageNumbers = (state: RootState, imageId: string): number[] => {
  return selectImagePageNumbers(state, imageId);
};

/**
 * Get detailed page information for an image
 * @param state - The Redux store state
 * @param imageId - The ID of the image
 * @returns Array of page info objects with pageNumber, pageId, and panelIds
 */
export const getImagePageInfo = (state: RootState, imageId: string) => {
  return selectImagePageInfo(state, imageId);
};

/**
 * Get a formatted string describing where an image is used
 * @param state - The Redux store state
 * @param imageId - The ID of the image
 * @returns A human-readable string like "Pages 1, 3" or "Not used"
 */
export const getImagePageDescription = (state: RootState, imageId: string): string => {
  const pageNumbers = getImagePageNumbers(state, imageId);
  
  if (pageNumbers.length === 0) {
    return 'Not used';
  }
  
  if (pageNumbers.length === 1) {
    return `Page ${pageNumbers[0]}`;
  }
  
  return `Pages ${pageNumbers.join(', ')}`;
};

/**
 * Check if an image is used on a specific page
 * @param state - The Redux store state
 * @param imageId - The ID of the image
 * @param pageNumber - The page number to check
 * @returns True if the image is used on the specified page
 */
export const isImageUsedOnPage = (state: RootState, imageId: string, pageNumber: number): boolean => {
  const pageNumbers = getImagePageNumbers(state, imageId);
  return pageNumbers.includes(pageNumber);
};

/**
 * Get all images used on a specific page
 * @param state - The Redux store state
 * @param pageNumber - The page number to check
 * @returns Array of image IDs used on the specified page
 */
export const getImagesUsedOnPage = (state: RootState, pageNumber: number): string[] => {
  const { images } = state.imageLibrary;
  const usedImages: string[] = [];
  
  for (const image of images) {
    if (image.isUsed && isImageUsedOnPage(state, image.id, pageNumber)) {
      usedImages.push(image.id);
    }
  }
  
  return usedImages;
}; 