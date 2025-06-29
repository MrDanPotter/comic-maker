import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageCard from './ReferenceImageCard';
import type { ReferenceImageType } from '../../types/comic';

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
const styleImage = {
  id: '1',
  url: 'https://picsum.photos/200/200?random=1',
  type: 'style' as ReferenceImageType,
  name: 'Comic Style Reference'
};

const characterImage = {
  id: '2',
  url: 'https://picsum.photos/200/200?random=2',
  type: 'character' as ReferenceImageType,
  name: 'Hero Character',
  customName: 'Superhero'
};

const sceneImage = {
  id: '3',
  url: 'https://picsum.photos/200/200?random=3',
  type: 'scene' as ReferenceImageType,
  name: 'City Scene',
  customName: 'Metropolitan City'
};

const characterImageNoName = {
  id: '4',
  url: 'https://picsum.photos/200/200?random=4',
  type: 'character' as ReferenceImageType,
  name: 'Villain Character'
};

export const Default: Story = {
  args: {
    image: styleImage,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const Selected: Story = {
  args: {
    image: characterImage,
    isSelected: true,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const Unreferenced: Story = {
  args: {
    image: sceneImage,
    isSelected: false,
    isReferenced: false,
    showStatusIndicator: true,
  },
};

export const Clickable: Story = {
  args: {
    image: styleImage,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
  },
};

export const WithExpandButton: Story = {
  args: {
    image: styleImage,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
  },
};

export const WithRemoveButton: Story = {
  args: {
    image: characterImage,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const SelectedWithRemove: Story = {
  args: {
    image: sceneImage,
    isSelected: true,
    isReferenced: false,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const NoStatusIndicator: Story = {
  args: {
    image: characterImageNoName,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: false,
  },
};

export const WithExpandAndRemove: Story = {
  args: {
    image: sceneImage,
    isSelected: false,
    isReferenced: true,
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const AllFeatures: Story = {
  args: {
    image: characterImage,
    isSelected: true,
    isReferenced: false,
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const StyleReference: Story = {
  args: {
    image: styleImage,
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
    image: characterImage,
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
    image: sceneImage,
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