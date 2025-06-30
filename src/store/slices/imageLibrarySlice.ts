import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image } from '../../types/comic';
import { selectPageByPanelId } from './comicPagesSlice';

interface ImageLibraryState {
  images: Image[];
}

const initialState: ImageLibraryState = {
  images: [],
};

const imageLibrarySlice = createSlice({
  name: 'imageLibrary',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(image => image.id !== action.payload);
    },
    markImageAsUsed: (state, action: PayloadAction<{ imageId: string; panelId: string }>) => {
      const image = state.images.find(img => img.id === action.payload.imageId);
      if (image) {
        image.isUsed = true;
        if (!image.usedInPanels.includes(action.payload.panelId)) {
          image.usedInPanels.push(action.payload.panelId);
        }
      }
    },
    markImageAsUnused: (state, action: PayloadAction<{ imageId: string; panelId: string }>) => {
      const image = state.images.find(img => img.id === action.payload.imageId);
      if (image) {
        image.usedInPanels = image.usedInPanels.filter(id => id !== action.payload.panelId);
        image.isUsed = image.usedInPanels.length > 0;
      }
    },
    markImageAsDownloaded: (state, action: PayloadAction<string>) => {
      const image = state.images.find(img => img.id === action.payload);
      if (image && image.source === 'ai') {
        image.isDownloaded = true;
      }
    },
  },
});

export const { addImage, removeImage, markImageAsUsed, markImageAsUnused, markImageAsDownloaded } = imageLibrarySlice.actions;

// Selectors
export const selectAllImages = (state: { imageLibrary: ImageLibraryState }) => state.imageLibrary.images;
export const selectImageById = (state: { imageLibrary: ImageLibraryState }, imageId: string) => 
  state.imageLibrary.images.find(image => image.id === imageId);
export const selectUsedImages = (state: { imageLibrary: ImageLibraryState }) => 
  state.imageLibrary.images.filter(image => image.isUsed);
export const selectUnusedImages = (state: { imageLibrary: ImageLibraryState }) => 
  state.imageLibrary.images.filter(image => !image.isUsed);

// Utility selectors for finding page numbers
export const selectImagePageNumbers = (state: { imageLibrary: ImageLibraryState; comicPages: any }, imageId: string) => {
  const image = state.imageLibrary.images.find(img => img.id === imageId);
  if (!image || !image.usedInPanels.length) return [];
  
  const pageNumbers: number[] = [];
  const seenPages = new Set<string>();
  
  for (const panelId of image.usedInPanels) {
    const page = selectPageByPanelId(state, panelId);
    if (page && !seenPages.has(page.id)) {
      pageNumbers.push(page.pageNumber);
      seenPages.add(page.id);
    }
  }
  
  return pageNumbers.sort((a, b) => a - b);
};

export const selectImagePageInfo = (state: { imageLibrary: ImageLibraryState; comicPages: any }, imageId: string) => {
  const image = state.imageLibrary.images.find(img => img.id === imageId);
  if (!image || !image.usedInPanels.length) return [];
  
  const pageInfo: Array<{ pageNumber: number; pageId: string; panelIds: string[] }> = [];
  const pageMap = new Map<string, { pageNumber: number; pageId: string; panelIds: string[] }>();
  
  for (const panelId of image.usedInPanels) {
    const page = selectPageByPanelId(state, panelId);
    if (page) {
      if (!pageMap.has(page.id)) {
        pageMap.set(page.id, {
          pageNumber: page.pageNumber,
          pageId: page.id,
          panelIds: []
        });
      }
      pageMap.get(page.id)!.panelIds.push(panelId);
    }
  }
  
  return Array.from(pageMap.values()).sort((a, b) => a.pageNumber - b.pageNumber);
};

export default imageLibrarySlice.reducer; 