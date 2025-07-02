import { configureStore } from '@reduxjs/toolkit';
import appStateReducer, { 
  setApiKeyAcknowledgement, 
  selectApiKeyAcknowledgement
} from '../appStateSlice';

describe('App State Slice - API Key Acknowledgement', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => configureStore({
    reducer: {
      appState: appStateReducer,
    },
  });

  beforeEach(() => {
    store = setupStore();
  });

  describe('initial state', () => {
    it('should have apiKeyAcknowledgement set to false initially', () => {
      const state = store.getState();
      expect(selectApiKeyAcknowledgement(state)).toBe(false);
    });
  });

  describe('setApiKeyAcknowledgement', () => {
    it('should set apiKeyAcknowledgement to true', () => {
      store.dispatch(setApiKeyAcknowledgement(true));
      const state = store.getState();
      expect(selectApiKeyAcknowledgement(state)).toBe(true);
    });

    it('should set apiKeyAcknowledgement to false', () => {
      // First set to true
      store.dispatch(setApiKeyAcknowledgement(true));
      expect(selectApiKeyAcknowledgement(store.getState())).toBe(true);
      
      // Then set to false
      store.dispatch(setApiKeyAcknowledgement(false));
      expect(selectApiKeyAcknowledgement(store.getState())).toBe(false);
    });

    it('should maintain other state properties unchanged', () => {
      const initialState = store.getState();
      store.dispatch(setApiKeyAcknowledgement(true));
      const newState = store.getState();
      
      // Check that other properties remain the same
      expect(newState.appState.aiEnabled).toBe(initialState.appState.aiEnabled);
      expect(newState.appState.apiKey).toBe(initialState.appState.apiKey);
      expect(newState.appState.showApiKeyModal).toBe(initialState.appState.showApiKeyModal);
      expect(newState.appState.systemContext).toBe(initialState.appState.systemContext);
      expect(newState.appState.useOpenAIImageGeneration).toBe(initialState.appState.useOpenAIImageGeneration);
      expect(newState.appState.referenceImages).toEqual(initialState.appState.referenceImages);
      
      // Only the acknowledgement should have changed
      expect(newState.appState.apiKeyAcknowledgement).toBe(true);
    });
  });
}); 