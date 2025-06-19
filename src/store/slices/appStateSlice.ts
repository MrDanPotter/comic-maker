import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  aiEnabled: boolean;
}

const initialState: AppState = {
  aiEnabled: false,
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    toggleAi: (state) => {
      state.aiEnabled = !state.aiEnabled;
    },
    setAiEnabled: (state, action: PayloadAction<boolean>) => {
      state.aiEnabled = action.payload;
    },
  },
});

export const { toggleAi, setAiEnabled } = appStateSlice.actions;

// Selectors
export const selectAiEnabled = (state: { appState: AppState }) => state.appState.aiEnabled;

export default appStateSlice.reducer; 