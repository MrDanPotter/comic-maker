import { configureStore } from '@reduxjs/toolkit';
import comicPagesReducer, { 
  addPage, 
  removePage, 
  reorderPages,
  selectPanelById,
  selectPageByPanelId
} from '../comicPagesSlice';
import imageLibraryReducer, { 
  addImage, 
  markImageAsUsed, 
  markImageAsUnused,
  selectImagePageNumbers,
  selectImagePageInfo
} from '../imageLibrarySlice';
import { ComicPage, Panel, Image } from '../../../types/comic';

describe('Image Page Tracking', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => configureStore({
    reducer: {
      comicPages: comicPagesReducer,
      imageLibrary: imageLibraryReducer,
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

  describe('Basic functionality', () => {
    it('should track which page an image is used on', () => {
      // Add a second page with panels
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      store.dispatch(addPage(page2));

      // Add an image and mark it as used in a panel
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));

      // Check that we can find the page number
      const pageNumbers = selectImagePageNumbers(store.getState(), 'image-1');
      expect(pageNumbers).toEqual([2]);
    });

    it('should track multiple pages for an image used across multiple pages', () => {
      // Add multiple pages
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1', 'panel-3-2']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));

      // Add an image and mark it as used in panels on different pages
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-3-2' }));

      // Check that we get both page numbers
      const pageNumbers = selectImagePageNumbers(store.getState(), 'image-1');
      expect(pageNumbers).toEqual([2, 3]);
    });

    it('should return empty array for unused images', () => {
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));

      const pageNumbers = selectImagePageNumbers(store.getState(), 'image-1');
      expect(pageNumbers).toEqual([]);
    });

    it('should return empty array for non-existent images', () => {
      const pageNumbers = selectImagePageNumbers(store.getState(), 'non-existent');
      expect(pageNumbers).toEqual([]);
    });
  });

  describe('Page reordering', () => {
    it('should maintain correct page numbers after reordering pages', () => {
      // Add multiple pages
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1', 'panel-3-2']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));

      // Add images and mark them as used
      const image1 = createTestImage('image-1');
      const image2 = createTestImage('image-2');
      store.dispatch(addImage(image1));
      store.dispatch(addImage(image2));
      
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-2', panelId: 'panel-3-1' }));

      // Verify initial page numbers
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([2]);
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([3]);

      // Reorder pages (move page 3 to position 1, page 1 to position 2, page 2 to position 3)
      const currentPages = store.getState().comicPages.pages;
      const reorderedPages = [
        currentPages[2], // page-3 (was page 3, now page 1)
        currentPages[0], // page-1 (was page 1, now page 2)
        currentPages[1], // page-2 (was page 2, now page 3)
      ];
      store.dispatch(reorderPages(reorderedPages));

      // Verify page numbers are updated correctly
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([3]); // image-1 is now on page 3
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([1]); // image-2 is now on page 1
    });

    it('should handle complex reordering scenarios', () => {
      // Add multiple pages
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1']);
      const page4 = createTestPage('page-4', 4, ['panel-4-1']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));
      store.dispatch(addPage(page4));

      // Add images used across multiple pages
      const image1 = createTestImage('image-1');
      const image2 = createTestImage('image-2');
      store.dispatch(addImage(image1));
      store.dispatch(addImage(image2));
      
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-4-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-2', panelId: 'panel-3-1' }));

      // Verify initial state
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([2, 4]);
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([3]);

      // Reorder: page 4 -> 1, page 2 -> 2, page 1 -> 3, page 3 -> 4
      const currentPages = store.getState().comicPages.pages;
      const reorderedPages = [
        currentPages[3], // page-4 (now page 1)
        currentPages[1], // page-2 (now page 2)
        currentPages[0], // page-1 (now page 3)
        currentPages[2], // page-3 (now page 4)
      ];
      store.dispatch(reorderPages(reorderedPages));

      // Verify updated page numbers
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([1, 2]); // was on pages 2,4, now on pages 1,2
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([4]); // was on page 3, now on page 4
    });
  });

  describe('Page removal', () => {
    it('should update page numbers correctly when pages are removed', () => {
      // Add multiple pages
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));

      // Add images
      const image1 = createTestImage('image-1');
      const image2 = createTestImage('image-2');
      store.dispatch(addImage(image1));
      store.dispatch(addImage(image2));
      
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-2', panelId: 'panel-3-1' }));

      // Verify initial state
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([2]);
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([3]);

      // Remove page 2
      store.dispatch(removePage('page-2'));

      // Verify page numbers are updated
      expect(selectImagePageNumbers(store.getState(), 'image-1')).toEqual([]); // image-1 is no longer used
      expect(selectImagePageNumbers(store.getState(), 'image-2')).toEqual([2]); // image-2 is now on page 2 (was page 3)
    });
  });

  describe('Detailed page info', () => {
    it('should provide detailed page information including panel IDs', () => {
      // Add a second page
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      store.dispatch(addPage(page2));

      // Add an image used in multiple panels on the same page
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-2' }));

      const pageInfo = selectImagePageInfo(store.getState(), 'image-1');
      expect(pageInfo).toEqual([
        {
          pageNumber: 2,
          pageId: 'page-2',
          panelIds: ['panel-2-1', 'panel-2-2']
        }
      ]);
    });

    it('should handle images used across multiple pages with multiple panels', () => {
      // Add multiple pages
      const page2 = createTestPage('page-2', 2, ['panel-2-1', 'panel-2-2']);
      const page3 = createTestPage('page-3', 3, ['panel-3-1']);
      store.dispatch(addPage(page2));
      store.dispatch(addPage(page3));

      // Add an image used in multiple panels across pages
      const image = createTestImage('image-1');
      store.dispatch(addImage(image));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-1' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-2-2' }));
      store.dispatch(markImageAsUsed({ imageId: 'image-1', panelId: 'panel-3-1' }));

      const pageInfo = selectImagePageInfo(store.getState(), 'image-1');
      expect(pageInfo).toEqual([
        {
          pageNumber: 2,
          pageId: 'page-2',
          panelIds: ['panel-2-1', 'panel-2-2']
        },
        {
          pageNumber: 3,
          pageId: 'page-3',
          panelIds: ['panel-3-1']
        }
      ]);
    });
  });

  describe('Panel and page lookups', () => {
    it('should find panels by ID across all pages', () => {
      // Add a second page
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      // Get the actual panel IDs from the store
      const state = store.getState();
      const firstPagePanelId = state.comicPages.pages[0].panels[0].id;
      const secondPagePanelId = state.comicPages.pages[1].panels[0].id;

      // Test finding panels
      const panel1 = selectPanelById(store.getState(), firstPagePanelId);
      const panel2 = selectPanelById(store.getState(), secondPagePanelId);
      const nonExistentPanel = selectPanelById(store.getState(), 'non-existent');

      expect(panel1).toBeDefined();
      expect(panel1?.pageId).toBe('1');
      expect(panel2).toBeDefined();
      expect(panel2?.pageId).toBe('page-2');
      expect(nonExistentPanel).toBeUndefined();
    });

    it('should find pages by panel ID', () => {
      // Add a second page
      const page2 = createTestPage('page-2', 2, ['panel-2-1']);
      store.dispatch(addPage(page2));

      // Get the actual panel IDs from the store
      const state = store.getState();
      const firstPagePanelId = state.comicPages.pages[0].panels[0].id;
      const secondPagePanelId = state.comicPages.pages[1].panels[0].id;

      // Test finding pages
      const page1 = selectPageByPanelId(store.getState(), firstPagePanelId);
      const page2Found = selectPageByPanelId(store.getState(), secondPagePanelId);
      const nonExistentPage = selectPageByPanelId(store.getState(), 'non-existent');

      expect(page1).toBeDefined();
      expect(page1?.pageNumber).toBe(1);
      expect(page2Found).toBeDefined();
      expect(page2Found?.pageNumber).toBe(2);
      expect(nonExistentPage).toBeUndefined();
    });
  });
}); 