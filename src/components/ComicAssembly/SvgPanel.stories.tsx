import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DragDropContext } from '@hello-pangea/dnd';
import SvgPanel from './SvgPanel';
import { placeholderImage } from '../../assets/placeholder';

const meta = {
  title: 'Comic/SvgPanel',
  component: SvgPanel,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <DragDropContext onDragEnd={() => {}}>
        <div style={{ width: '400px', height: '400px', position: 'relative' }}>
          <Story />
        </div>
      </DragDropContext>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SvgPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic square panel without an image
export const EmptyPanel: Story = {
  args: {
    panel: {
      id: '1',
      shape: 'polygon',
      points: [
        [50, 50],
        [350, 50],
        [350, 350],
        [50, 350],
      ],
      dropZone: {
        top: 50,
        left: 50,
        width: 300,
        height: 300,
      },
    },
    pageId: 'page-1',
  },
};

// Panel with a placeholder image
export const WithImage: Story = {
  args: {
    panel: {
      id: '2',
      shape: 'polygon',
      points: [
        [50, 50],
        [350, 50],
        [350, 350],
        [50, 350],
      ],
      dropZone: {
        top: 50,
        left: 50,
        width: 300,
        height: 300,
      },
      imageUrl: placeholderImage,
    },
    pageId: 'page-1',
  },
};

// Diagonal panel with image
export const DiagonalPanel: Story = {
  args: {
    panel: {
      id: '3',
      shape: 'polygon',
      points: [
        [50, 50],
        [350, 150],
        [250, 350],
        [50, 250],
      ],
      dropZone: {
        top: 50,
        left: 50,
        width: 300,
        height: 300,
      },
      imageUrl: placeholderImage,
    },
    pageId: 'page-1',
  },
}; 