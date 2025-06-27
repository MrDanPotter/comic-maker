import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SystemContextModal from '../SystemContextModal';
import appStateSlice from '../../../store/slices/appStateSlice';
import imageLibrarySlice from '../../../store/slices/imageLibrarySlice';

// Mock the ImageLibrarySelectorModal
jest.mock('../ImageLibrarySelectorModal', () => {
  return function MockImageLibrarySelectorModal({ isOpen, onClose, onImageSelected, imageType }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="image-library-selector">
        <button onClick={() => onImageSelected({ id: 'test-id', url: 'test-url', type: imageType, name: 'test.jpg' })}>
          Select Test Image
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock the Image component
jest.mock('../../Image', () => {
  return function MockImage({ src, alt }: any) {
    return <img src={src} alt={alt} data-testid="mock-image" />;
  };
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      appState: appStateSlice,
      imageLibrary: imageLibrarySlice,
    },
    preloadedState: {
      appState: {
        aiEnabled: true,
        apiKey: 'test-key',
        showApiKeyModal: false,
        systemContext: 'Test context',
        useOpenAIImageGeneration: true,
        referenceImages: [],
      },
      imageLibrary: {
        images: [
          {
            id: 'lib-1',
            url: 'data:image/jpeg;base64,test1',
            isUsed: false,
            usedInPanels: [],
            source: 'user' as const,
          },
          {
            id: 'lib-2',
            url: 'data:image/jpeg;base64,test2',
            isUsed: false,
            usedInPanels: [],
            source: 'user' as const,
          },
        ],
      },
    },
  });
};

describe('SystemContextModal with Image Source Selection', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with filesystem as default source', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <SystemContextModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          currentContext="Test context"
          currentUseOpenAI={true}
        />
      </Provider>
    );

    // Check that "Use Filesystem" is selected by default
    const filesystemOption = screen.getByText('Use Filesystem');
    const imageLibraryOption = screen.getByText('Use Image Library');
    
    expect(filesystemOption).toHaveStyle({ background: '#667eea' });
    expect(imageLibraryOption).toHaveStyle({ background: 'transparent' });
  });

  test('should switch to image library when clicked', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <SystemContextModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          currentContext="Test context"
          currentUseOpenAI={true}
        />
      </Provider>
    );

    const imageLibraryOption = screen.getByText('Use Image Library');
    fireEvent.click(imageLibraryOption);

    // Check that "Use Image Library" is now selected
    expect(imageLibraryOption).toHaveStyle({ background: '#667eea' });
  });

  test('should open image library selector when image library is selected and button is clicked', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <SystemContextModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          currentContext="Test context"
          currentUseOpenAI={true}
        />
      </Provider>
    );

    // Select image library
    const imageLibraryOption = screen.getByText('Use Image Library');
    fireEvent.click(imageLibraryOption);

    // Click on a reference image button
    const styleButton = screen.getByText('Style');
    fireEvent.click(styleButton);

    // Check that the image library selector is opened
    expect(screen.getByTestId('image-library-selector')).toBeInTheDocument();
  });

  test('should use filesystem when filesystem is selected and button is clicked', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <SystemContextModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          currentContext="Test context"
          currentUseOpenAI={true}
        />
      </Provider>
    );

    // Ensure filesystem is selected (default)
    const filesystemOption = screen.getByText('Use Filesystem');
    expect(filesystemOption).toHaveStyle({ background: '#667eea' });

    // Click on a reference image button
    const styleButton = screen.getByText('Style');
    fireEvent.click(styleButton);

    // Check that the image library selector is NOT opened
    expect(screen.queryByTestId('image-library-selector')).not.toBeInTheDocument();
  });
}); 