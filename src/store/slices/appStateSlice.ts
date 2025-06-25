import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReferenceImage {
  id: string;
  url: string;
  type: 'style' | 'character' | 'scene';
  name: string;
  customName?: string; // Optional custom name for character and scene references
}

interface AppState {
  aiEnabled: boolean;
  apiKey: string | null;
  showApiKeyModal: boolean;
  systemContext: string;
  useOpenAIImageGeneration: boolean;
  referenceImages: ReferenceImage[];
}

const initialState: AppState = {
  aiEnabled: false,
  apiKey: null,
  showApiKeyModal: false,
  systemContext: '',
  useOpenAIImageGeneration: true,
  referenceImages: [],
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    toggleAi: (state) => {
      // If AI is being enabled and no API key exists, show the modal
      if (!state.aiEnabled && !state.apiKey) {
        state.showApiKeyModal = true;
      } else {
        state.aiEnabled = !state.aiEnabled;
      }
    },
    setAiEnabled: (state, action: PayloadAction<boolean>) => {
      state.aiEnabled = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      state.aiEnabled = true;
      state.showApiKeyModal = false;
    },
    showApiKeyModal: (state) => {
      state.showApiKeyModal = true;
    },
    hideApiKeyModal: (state) => {
      state.showApiKeyModal = false;
    },
    clearApiKey: (state) => {
      state.apiKey = null;
      state.aiEnabled = false;
    },
    setSystemContext: (state, action: PayloadAction<string>) => {
      state.systemContext = action.payload;
    },
    setUseOpenAIImageGeneration: (state, action: PayloadAction<boolean>) => {
      state.useOpenAIImageGeneration = action.payload;
    },
    addReferenceImage: (state, action: PayloadAction<ReferenceImage>) => {
      state.referenceImages.push(action.payload);
    },
    removeReferenceImage: (state, action: PayloadAction<string>) => {
      state.referenceImages = state.referenceImages.filter(img => img.id !== action.payload);
    },
    updateReferenceImageName: (state, action: PayloadAction<{ id: string; customName: string }>) => {
      const image = state.referenceImages.find(img => img.id === action.payload.id);
      if (image) {
        image.customName = action.payload.customName;
      }
    },
  },
});

export const { 
  toggleAi, 
  setAiEnabled, 
  setApiKey, 
  showApiKeyModal, 
  hideApiKeyModal,
  clearApiKey,
  setSystemContext,
  setUseOpenAIImageGeneration,
  addReferenceImage,
  removeReferenceImage,
  updateReferenceImageName
} = appStateSlice.actions;

// Selectors
export const selectAiEnabled = (state: { appState: AppState }) => state.appState.aiEnabled;
export const selectApiKey = (state: { appState: AppState }) => state.appState.apiKey;
export const selectShowApiKeyModal = (state: { appState: AppState }) => state.appState.showApiKeyModal;
export const selectSystemContext = (state: { appState: AppState }) => state.appState.systemContext;
export const selectUseOpenAIImageGeneration = (state: { appState: AppState }) => state.appState.useOpenAIImageGeneration;
export const selectReferenceImages = (state: { appState: AppState }) => state.appState.referenceImages;

export default appStateSlice.reducer; 