import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageSelectorModal from './ReferenceImageSelectorModal';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { addReferenceImage } from '../../store/slices/appStateSlice';
import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from '../../store/slices/appStateSlice';
import type { ReferenceImageType } from '../../types/comic';
import image133 from '../../assets/133-200x200.jpg';
import image913 from '../../assets/913-300x300.jpg';

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
    url: image133,
    type: 'style' as ReferenceImageType,
    name: 'Comic Style Reference'
  },
  {
    id: '2',
    url: image913,
    type: 'character' as ReferenceImageType,
    name: 'Hero Character',
    customName: 'Superhero'
  },
  {
    id: '3',
    url: image133,
    type: 'scene' as ReferenceImageType,
    name: 'City Scene',
    customName: 'Metropolitan City'
  },
  {
    id: '4',
    url: image913,
    type: 'character' as ReferenceImageType,
    name: 'Villain Character'
  }
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