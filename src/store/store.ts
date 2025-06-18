import { configureStore } from '@reduxjs/toolkit';
import comicPagesReducer from './slices/comicPagesSlice';
import imageLibraryReducer from './slices/imageLibrarySlice';

export const store = configureStore({
  reducer: {
    comicPages: comicPagesReducer,
    imageLibrary: imageLibraryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 