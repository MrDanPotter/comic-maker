import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageSelectorModal from './ReferenceImageSelectorModal';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { addReferenceImage } from '../../store/slices/appStateSlice';
import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from '../../store/slices/appStateSlice';

const meta: Meta<typeof ReferenceImageSelectorModal> = {
  title: 'Components/AiImageModal/ReferenceImageSelectorModal',
  component: ReferenceImageSelectorModal,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    promptText: {
      control: 'text',
      description: 'The current prompt text to check for image references',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample reference images for testing
const sampleReferenceImages = [
  {
    id: '1',
    url: 'https://picsum.photos/200/200?random=1',
    type: 'style' as const,
    name: 'comic_style.jpg',
  },
  {
    id: '2',
    url: 'https://picsum.photos/200/200?random=2',
    type: 'character' as const,
    name: 'superhero.jpg',
    customName: 'Spider-Man',
  },
  {
    id: '3',
    url: 'https://picsum.photos/200/200?random=3',
    type: 'scene' as const,
    name: 'cityscape.jpg',
    customName: 'New York City',
  },
  {
    id: '4',
    url: 'https://picsum.photos/200/200?random=4',
    type: 'character' as const,
    name: 'villain.jpg',
    customName: 'Green Goblin',
  },
];

// Add sample images to store for testing
sampleReferenceImages.forEach(image => {
  store.dispatch(addReferenceImage(image));
});

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onImagesSelected: (images) => console.log('Images selected:', images),
    selectedImages: [],
    promptText: 'A superhero fighting a villain in New York City',
  },
};

export const WithSelectedImages: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onImagesSelected: (images) => console.log('Images selected:', images),
    selectedImages: [sampleReferenceImages[1], sampleReferenceImages[2]], // Spider-Man and NYC
    promptText: 'A superhero fighting a villain in New York City',
  },
};

export const WithUnreferencedImages: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onImagesSelected: (images) => console.log('Images selected:', images),
    selectedImages: [sampleReferenceImages[3]], // Green Goblin (not mentioned in prompt)
    promptText: 'A superhero fighting in New York City', // Doesn't mention "Green Goblin"
  },
};

export const EmptyState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onImagesSelected: (images) => console.log('Images selected:', images),
    selectedImages: [],
    promptText: 'A simple prompt',
  },
  decorators: [
    (Story) => {
      // Create a fresh store with empty state for the empty state story
      const emptyStore = configureStore({
        reducer: {
          appState: appStateReducer,
        },
        preloadedState: {
          appState: {
            aiEnabled: false,
            apiKey: null,
            showApiKeyModal: false,
            systemContext: '',
            useOpenAIImageGeneration: true,
            referenceImages: [], // Empty reference images
          },
        },
      });
      
      return (
        <Provider store={emptyStore}>
          <Story />
        </Provider>
      );
    },
  ],
}; 