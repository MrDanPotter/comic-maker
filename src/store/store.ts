import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import comicPagesReducer from './slices/comicPagesSlice';
import imageLibraryReducer from './slices/imageLibrarySlice';
import appStateReducer from './slices/appStateSlice';

export const store = configureStore({
  reducer: {
    comicPages: comicPagesReducer,
    imageLibrary: imageLibraryReducer,
    appState: appStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 