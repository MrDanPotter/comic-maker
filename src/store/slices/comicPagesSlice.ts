import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComicPage, Panel } from '../../types/comic';
import { layouts } from '../../utils/layouts';

interface ComicPagesState {
  pages: ComicPage[];
}

const initialState: ComicPagesState = {
  pages: [{
    id: "1",
    panels: layouts.fullPage(),
  }],
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
  updatePanel,
  setPanelImage
} = comicPagesSlice.actions;

// Selectors
export const selectAllPages = (state: { comicPages: ComicPagesState }) => state.comicPages.pages;
export const selectPageById = (state: { comicPages: ComicPagesState }, pageId: string) => 
  state.comicPages.pages.find(page => page.id === pageId);
export const selectPanelById = (state: { comicPages: ComicPagesState }, pageId: string, panelId: string) => {
  const page = state.comicPages.pages.find(p => p.id === pageId);
  return page?.panels.find(p => p.id === panelId);
};

export default comicPagesSlice.reducer; 