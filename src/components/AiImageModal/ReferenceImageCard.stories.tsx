import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ReferenceImageCard from './ReferenceImageCard';

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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample reference images for testing
const sampleImages = [
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
];

export const Default: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
  },
};

export const Selected: Story = {
  args: {
    image: sampleImages[1],
    isSelected: true,
    isReferenced: true,
  },
};

export const Unreferenced: Story = {
  args: {
    image: sampleImages[2],
    isSelected: false,
    isReferenced: false,
  },
};

export const Clickable: Story = {
  args: {
    image: sampleImages[0],
    isSelected: false,
    isReferenced: true,
    onClick: () => console.log('Card clicked'),
  },
};

export const AllFeatures: Story = {
  args: {
    image: sampleImages[1],
    isSelected: true,
    isReferenced: false,
    onClick: () => console.log('Card clicked'),
  },
};