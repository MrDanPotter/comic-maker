import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComicPage, Panel } from '../../types/comic';
import { layouts } from '../../utils/layouts';

interface ComicPagesState {
  pages: ComicPage[];
}

const initialState: ComicPagesState = {
  pages: [{
    id: "1",
    pageNumber: 1,
    panels: layouts.fullPage().map(panel => ({
      ...panel,
      pageId: "1"
    })),
  }],
};

const comicPagesSlice = createSlice({
  name: 'comicPages',
  initialState,
  reducers: {
    addPage: (state, action: PayloadAction<ComicPage>) => {
      const newPageNumber = state.pages.length + 1;
      const pageWithNumber = {
        ...action.payload,
        pageNumber: newPageNumber,
        panels: action.payload.panels.map(panel => ({
          ...panel,
          pageId: action.payload.id
        }))
      };
      state.pages.push(pageWithNumber);
    },
    removePage: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(page => page.id !== action.payload);
      // Recalculate page numbers after removal
      state.pages.forEach((page, index) => {
        page.pageNumber = index + 1;
        page.panels.forEach(panel => {
          panel.pageId = page.id;
        });
      });
    },
    reorderPages: (state, action: PayloadAction<ComicPage[]>) => {
      state.pages = action.payload.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
        panels: page.panels.map(panel => ({
          ...panel,
          pageId: page.id
        }))
      }));
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
export const selectPanelById = (state: { comicPages: ComicPagesState }, panelId: string) => {
  for (const page of state.comicPages.pages) {
    const panel = page.panels.find(p => p.id === panelId);
    if (panel) return panel;
  }
  return undefined;
};
export const selectPageByPanelId = (state: { comicPages: ComicPagesState }, panelId: string) => {
  for (const page of state.comicPages.pages) {
    const panel = page.panels.find(p => p.id === panelId);
    if (panel) return page;
  }
  return undefined;
};

export default comicPagesSlice.reducer; 