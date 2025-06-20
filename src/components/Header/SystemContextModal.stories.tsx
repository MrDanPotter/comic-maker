import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import SystemContextModal from './SystemContextModal';

const meta: Meta<typeof SystemContextModal> = {
  title: 'Header/SystemContextModal',
  component: SystemContextModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    currentContext: {
      control: 'text',
      description: 'The current system context text',
    },
    onClose: {
      action: 'closed',
      description: 'Called when the modal is closed',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Called when the form is submitted with new context',
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    currentContext: '',
  },
};

export const WithExistingContext: Story = {
  args: {
    isOpen: true,
    currentContext: 'Create images in a comic book style with bold colors, dynamic poses, and dramatic lighting. Use a modern superhero aesthetic with clean lines and vibrant backgrounds.',
  },
};

export const LongContext: Story = {
  args: {
    isOpen: true,
    currentContext: `Generate images in a distinctive cyberpunk aesthetic with neon lighting, metallic surfaces, and futuristic urban environments. Use a dark color palette with bright accent colors like electric blue, hot pink, and neon green. Include atmospheric effects like rain, fog, and lens flares. Characters should have sleek, high-tech clothing and accessories. Buildings should feature geometric shapes, holographic displays, and flying vehicles. The overall style should be cinematic with dramatic shadows and high contrast lighting.`,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    currentContext: 'This modal is closed',
  },
};

export const Interactive: Story = {
  args: {
    isOpen: true,
    currentContext: 'Interactive story - try editing the context!',
  },
  parameters: {
    docs: {
      description: {
        story: 'This story allows you to interact with the modal. Try editing the context text and submitting the form.',
      },
    },
  },
}; 