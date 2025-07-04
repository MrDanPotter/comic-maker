import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageCard from './ReferenceImageCard';
import type { ReferenceImageType } from '../../../types/comic';
import image133 from '../../../assets/133-200x200.jpg';
import image913 from '../../../assets/913-300x300.jpg';

const meta: Meta<typeof ReferenceImageCard> = {
  title: 'Components/shared/ReferenceImageCard',
  component: ReferenceImageCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'Whether the card is selected',
    },
    statusText: {
      control: 'text',
      description: 'The status text to display',
    },
    statusColor: {
      control: 'color',
      description: 'The color of the status text',
    },
    showStatusIndicator: {
      control: 'boolean',
      description: 'Whether to show the status indicator',
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
  url: image133,
  type: 'style' as ReferenceImageType,
  name: 'Comic Style Reference'
};

const characterImage = {
  id: '2',
  url: image913,
  type: 'character' as ReferenceImageType,
  name: 'Hero Character',
  customName: 'Superhero'
};

const sceneImage = {
  id: '3',
  url: image133,
  type: 'scene' as ReferenceImageType,
  name: 'City Scene',
  customName: 'Metropolitan City'
};

const characterImageNoName = {
  id: '4',
  url: image913,
  type: 'character' as ReferenceImageType,
  name: 'Villain Character'
};

export const Default: Story = {
  args: {
    url: styleImage.url,
    alt: styleImage.name,
    type: styleImage.type,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
  },
};

export const Selected: Story = {
  args: {
    url: characterImage.url,
    alt: characterImage.name,
    type: characterImage.type,
    customName: characterImage.customName,
    isSelected: true,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
  },
};

export const Unreferenced: Story = {
  args: {
    url: sceneImage.url,
    alt: sceneImage.name,
    type: sceneImage.type,
    customName: sceneImage.customName,
    isSelected: false,
    statusText: 'Not referenced',
    statusColor: '#ff9800',
    showStatusIndicator: true,
  },
};

export const Clickable: Story = {
  args: {
    url: styleImage.url,
    alt: styleImage.name,
    type: styleImage.type,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
  },
};

export const WithExpandButton: Story = {
  args: {
    url: styleImage.url,
    alt: styleImage.name,
    type: styleImage.type,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
  },
};

export const WithRemoveButton: Story = {
  args: {
    url: characterImage.url,
    alt: characterImage.name,
    type: characterImage.type,
    customName: characterImage.customName,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const SelectedWithRemove: Story = {
  args: {
    url: sceneImage.url,
    alt: sceneImage.name,
    type: sceneImage.type,
    customName: sceneImage.customName,
    isSelected: true,
    statusText: 'Not referenced',
    statusColor: '#ff9800',
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const NoStatusIndicator: Story = {
  args: {
    url: characterImageNoName.url,
    alt: characterImageNoName.name,
    type: characterImageNoName.type,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: false,
  },
};

export const WithExpandAndRemove: Story = {
  args: {
    url: sceneImage.url,
    alt: sceneImage.name,
    type: sceneImage.type,
    customName: sceneImage.customName,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
    showStatusIndicator: true,
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const AllFeatures: Story = {
  args: {
    url: characterImage.url,
    alt: characterImage.name,
    type: characterImage.type,
    customName: characterImage.customName,
    isSelected: true,
    statusText: 'Not referenced',
    statusColor: '#ff9800',
    showStatusIndicator: true,
    onClick: () => console.log('Card clicked'),
    onRemove: () => console.log('Remove button clicked'),
  },
};

export const StyleReference: Story = {
  args: {
    url: styleImage.url,
    alt: styleImage.name,
    type: styleImage.type,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
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
    url: characterImage.url,
    alt: characterImage.name,
    type: characterImage.type,
    customName: characterImage.customName,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
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
    url: sceneImage.url,
    alt: sceneImage.name,
    type: sceneImage.type,
    customName: sceneImage.customName,
    isSelected: false,
    statusText: 'Referenced',
    statusColor: '#4caf50',
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