import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageCard from './ReferenceImageCard';
import localImage from '../../assets/913-300x300.jpg';

const meta: Meta<typeof ReferenceImageCard> = {
  title: 'Components/AiImageModal/ReferenceImageCard',
  component: ReferenceImageCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'Whether the card is selected',
    },
    isReferenced: {
      control: 'boolean',
      description: 'Whether the image is referenced in the prompt',
    },
    showStatusIndicator: {
      control: 'boolean',
      description: 'Whether to show the reference status indicator',
    },
    onExpand: {
      action: 'expanded',
      description: 'Callback when expand button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample reference images for testing
const sampleImages = [
  {
    id: '1',
    url: localImage,
    type: 'style' as const,
    name: 'comic_style.jpg',
  },
  {
    id: '2',
    url: localImage,
    type: 'character' as const,
    name: 'superhero.jpg',
    customName: 'Spider-Man',
  },
  {
    id: '3',
    url: localImage,
    type: 'scene' as const,
    name: 'cityscape.jpg',
    customName: 'New York City',
  },
  {
    id: '4',
    url: localImage,
    type: 'character' as const,
    name: 'villain.jpg',
    customName: 'Green Goblin',
  },
];

export const Default: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const Selected: Story = {
  args: {
    image: sampleImages[1],
    isSelected: true,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const Unreferenced: Story = {
  args: {
    image: sampleImages[2],
    isSelected: false,
    isReferenced: false,
    showStatusIndicator: true,
  },
};

export const Clickable: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
  },
};

export const WithExpandButton: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const WithRemoveButton: Story = {
  args: {
    image: sampleImages[1],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const SelectedWithRemove: Story = {
  args: {
    image: sampleImages[2],
    isSelected: true,
    isReferenced: false,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const NoStatusIndicator: Story = {
  args: {
    image: sampleImages[3],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: false,
  },
};

export const WithExpandAndRemove: Story = {
  args: {
    image: sampleImages[2],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const AllFeatures: Story = {
  args: {
    image: sampleImages[1],
    isSelected: true,
    isReferenced: false,
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const StyleReference: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A style reference image without a custom name.',
      },
    },
  },
};

export const CharacterReference: Story = {
  args: {
    image: sampleImages[1],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A character reference image with a custom name.',
      },
    },
  },
};

export const SceneReference: Story = {
  args: {
    image: sampleImages[2],
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A scene reference image with a custom name.',
      },
    },
  },
};