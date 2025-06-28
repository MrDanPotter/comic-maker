import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { placeholderImage, placeholderImageLarge } from '../../assets/placeholder';
import { AspectRatio } from '../../types/comic';
import AiImageModal from './AiImageModal';

const meta: Meta<typeof AiImageModal> = {
  title: 'Components/AiImageModal',
  component: AiImageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open or closed',
    },
    aspectRatio: {
      control: 'text',
      description: 'The aspect ratio for the generated image (e.g., "1:1", "16:9", "4:3")',
    },
    apiKey: {
      control: 'text',
      description: 'OpenAI API key for image generation',
    },
    imageUrl: {
      control: 'text',
      description: 'Optional existing image URL to display in the preview area',
    },
    onClose: {
      description: 'Callback function when modal is closed',
    },
    onImageGenerated: {
      description: 'Callback function when an image is successfully generated',
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock API key for testing
const mockApiKey = 'sk-test-1234567890abcdef';

export const Default: Story = {
  args: {
    isOpen: true,
    aspectRatio: 'square' as AspectRatio,
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string, prompt?: string, referenceImages?: any[]) => console.log('Image generated:', imageUrl, 'with prompt:', prompt, 'and reference images:', referenceImages),
  },
};

export const WithExistingImage: Story = {
  args: {
    isOpen: true,
    aspectRatio: 'square' as AspectRatio,
    apiKey: mockApiKey,
    imageUrl: placeholderImage,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string, prompt?: string, referenceImages?: any[]) => console.log('Image generated:', imageUrl, 'with prompt:', prompt, 'and reference images:', referenceImages),
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the modal with an existing image provided via the imageUrl prop. The image will be displayed in the preview area with "Existing Image" as the title.',
      },
    },
  },
};

export const WithFullResolutionImage: Story = {
  args: {
    isOpen: true,
    aspectRatio: 'square' as AspectRatio,
    apiKey: mockApiKey,
    imageUrl: placeholderImageLarge,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string, prompt?: string, referenceImages?: any[]) => console.log('Image generated:', imageUrl, 'with prompt:', prompt, 'and reference images:', referenceImages),
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the modal with an existing image. Click on the image to view it in full resolution with a frosted background overlay. Click anywhere else to close the full resolution view.',
      },
    },
  },
};

export const WithExistingPrompt: Story = {
  args: {
    isOpen: true,
    aspectRatio: 'square' as AspectRatio,
    apiKey: mockApiKey,
    imageUrl: placeholderImage,
    existingPrompt: 'A majestic dragon soaring through a stormy sky with lightning illuminating its scales',
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string, prompt?: string, referenceImages?: any[]) => console.log('Image generated:', imageUrl, 'with prompt:', prompt, 'and reference images:', referenceImages),
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the modal with an existing image and prompt. The prompt will be pre-populated in the text area, allowing users to modify it for regeneration. Note that the "Use Image" button is hidden since the existing image should already be in the user\'s library.',
      },
    },
  },
};
