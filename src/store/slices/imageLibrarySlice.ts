import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Image {
  id: string;
  url: string;
  isUsed: boolean;
  usedInPanels: string[]; // Array of panel IDs where this image is used
}

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
  },
});

export const { addImage, removeImage, markImageAsUsed, markImageAsUnused } = imageLibrarySlice.actions;

// Selectors
export const selectAllImages = (state: { imageLibrary: ImageLibraryState }) => state.imageLibrary.images;
export const selectImageById = (state: { imageLibrary: ImageLibraryState }, imageId: string) => 
  state.imageLibrary.images.find(image => image.id === imageId);
export const selectUsedImages = (state: { imageLibrary: ImageLibraryState }) => 
  state.imageLibrary.images.filter(image => image.isUsed);
export const selectUnusedImages = (state: { imageLibrary: ImageLibraryState }) => 
  state.imageLibrary.images.filter(image => !image.isUsed);

export default imageLibrarySlice.reducer; 