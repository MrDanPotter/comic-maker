import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComicPage, Panel } from '../../types/comic';

interface ComicPagesState {
  pages: ComicPage[];
  currentPageId: string | null;
}

const initialState: ComicPagesState = {
  pages: [],
  currentPageId: null,
};

const comicPagesSlice = createSlice({
  name: 'comicPages',
  initialState,
  reducers: {
    addPage: (state, action: PayloadAction<ComicPage>) => {
      state.pages.push(action.payload);
    },
    removePage: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(page => page.id !== action.payload);
    },
    reorderPages: (state, action: PayloadAction<ComicPage[]>) => {
      state.pages = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string | null>) => {
      state.currentPageId = action.payload;
    },
    updatePanel: (state, action: PayloadAction<{ pageId: string; panelId: string; updates: Partial<Panel> }>) => {
      const page = state.pages.find(p => p.id === action.payload.pageId);
      if (page) {
        const panel = page.panels.find(p => p.id === action.payload.panelId);
        if (panel) {
          Object.assign(panel, action.payload.updates);
        }
      }
    },
    setPanelImage: (state, action: PayloadAction<{ pageId: string; panelId: string; imageUrl: string | undefined }>) => {
      const page = state.pages.find(p => p.id === action.payload.pageId);
      if (page) {
        const panel = page.panels.find(p => p.id === action.payload.panelId);
        if (panel) {
          panel.imageUrl = action.payload.imageUrl;
        }
      }
    },
  },
});

export const { 
  addPage, 
  removePage, 
  reorderPages, 
  setCurrentPage,
  updatePanel,
  setPanelImage
} = comicPagesSlice.actions;
export default comicPagesSlice.reducer; 