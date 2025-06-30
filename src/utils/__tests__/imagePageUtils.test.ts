import { configureStore } from '@reduxjs/toolkit';
import comicPagesReducer, { addPage } from '../../store/slices/comicPagesSlice';
import imageLibraryReducer, { addImage, markImageAsUsed } from '../../store/slices/imageLibrarySlice';
import appStateReducer from '../../store/slices/appStateSlice';
import { 
  getImagePageNumbers, 
  getImagePageInfo, 
  getImagePageDescription, 
  isImageUsedOnPage,
  getImagesUsedOnPage 
} from '../imagePageUtils';
import { ComicPage, Image } from '../../types/comic';

describe('Image Page Utils', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => configureStore({
    reducer: {
      comicPages: comicPagesReducer,
      imageLibrary: imageLibraryReducer,
      appState: appStateReducer,
    },
  });

  beforeEach(() => {
    store = setupStore();
  });

  const createTestPage = (id: string, pageNumber: number, panelIds: string[]): ComicPage => ({
    id,
    pageNumber,
    panels: panelIds.map(panelId => ({
      id: panelId,
      pageId: id,
      shape: 'polygon' as const,
      points: [[0, 0], [100, 0], [100, 100], [0, 100]],
    })),
  });

  const createTestImage = (id: string, usedInPanels: string[] = []): Image => ({
    id,
    url: `https://example.com/image-${id}.jpg`,
    isUsed: usedInPanels.length > 0,
    usedInPanels,
    source: 'user' as const,
  });

  describe('getImagePageNumbers', () => {
    it('should return page numbers for used images', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));

      const pageNumbers = getImagePageNumbers(store.getState(), 'image-1');
      expect(pageNumbers).toEqual([2]);
    });

    it('should return empty array for unused images', () => {
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));

      const pageNumbers = getImagePageNumbers(store.getState(), 'image-1');
      expect(pageNumbers).toEqual([]);
    });
  });

  describe('getImagePageInfo', () => {
    it('should return detailed page information', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      store.dispatch(addPage(page2));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-2' }));

      const pageInfo = getImagePageInfo(store.getState(), 'image-1');
      expect(pageInfo).toEqual([
        {
          pageNumber: 2,
          pageId: 'page-2',
          panelIds: ['panel-2-1', 'panel-2-2']
        }
      ]);
    });
  });

  describe('getImagePageDescription', () => {
    it('should return "Not used" for unused images', () => {
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));

      const description = getImagePageDescription(store.getState(), 'image-1');
      expect(description).toBe('Not used');
    });

    it('should return "Page X" for single page usage', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));

      const description = getImagePageDescription(store.getState(), 'image-1');
      expect(description).toBe('Page 2');
    });

    it('should return "Pages X, Y" for multiple page usage', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-3-1' }));

      const description = getImagePageDescription(store.getState(), 'image-1');
      expect(description).toBe('Pages 2, 3');
    });
  });

  describe('isImageUsedOnPage', () => {
    it('should return true when image is used on specified page', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));

      expect(isImageUsedOnPage(store.getState(), 'image-1', 2)).toBe(true);
    });

    it('should return false when image is not used on specified page', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));

      expect(isImageUsedOnPage(store.getState(), 'image-1', 1)).toBe(false);
    });
  });

  describe('getImagesUsedOnPage', () => {
    it('should return all images used on a specific page', () => {
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      store.dispatch(addPage(page2));

      const image1 = createTestImage('image-1');
      const image2 = createTestImage('image-2');
      store.dispatch(addImage(image1));
      store.dispatch(addImage(image2));
      
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-2', panelId: 'panel-2-2' }));

      const imagesOnPage = getImagesUsedOnPage(store.getState(), 2);
      expect(imagesOnPage).toContain('image-1');
      expect(imagesOnPage).toContain('image-2');
      expect(imagesOnPage).toHaveLength(2);
    });

    it('should return empty array for page with no images', () => {
      const imagesOnPage = getImagesUsedOnPage(store.getState(), 1);
      expect(imagesOnPage).toEqual([]);
    });
  });
}); 