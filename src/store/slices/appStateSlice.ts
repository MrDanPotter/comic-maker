import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  aiEnabled: boolean;
  apiKey: string | null;
  showApiKeyModal: boolean;
}

const initialState: AppState = {
  aiEnabled: false,
  apiKey: null,
  showApiKeyModal: false,
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
  },
});

export const { 
  toggleAi, 
  setAiEnabled, 
  setApiKey, 
  showApiKeyModal, 
  hideApiKeyModal,
  clearApiKey 
} = appStateSlice.actions;

// Selectors
export const selectAiEnabled = (state: { appState: AppState }) => state.appState.aiEnabled;
export const selectApiKey = (state: { appState: AppState }) => state.appState.apiKey;
export const selectShowApiKeyModal = (state: { appState: AppState }) => state.appState.showApiKeyModal;

export default appStateSlice.reducer; 