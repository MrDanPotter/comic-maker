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
        <div style={{ width: '800px', height: '1000px', position: 'relative', background: 'white' }}>
          <Story />
        </div>
      </DragDropContext>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SvgPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base args that all stories will use
const baseArgs = {
  pageId: 'page-1',
  onPanelsUpdate: console.log,
};

// Single empty panel
export const EmptyPanel: Story = {
  args: {
    ...baseArgs,
    panels: [{
      id: '1',
      pageId: 'page-1',
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
    }],
  },
};

// Single panel with a placeholder image
export const WithImage: Story = {
  args: {
    ...baseArgs,
    panels: [{
      id: '2',
      pageId: 'page-1',
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
    }],
  },
};

// Multiple panels with different shapes
export const MultiplePanels: Story = {
  args: {
    ...baseArgs,
    panels: [
      {
        id: '3',
        pageId: 'page-1',
        shape: 'polygon',
        points: [
          [50, 50],
          [175, 50],
          [175, 175],
          [50, 175],
        ],
        dropZone: {
          top: 50,
          left: 50,
          width: 125,
          height: 125,
        },
        imageUrl: placeholderImage,
      },
      {
        id: '4',
        pageId: 'page-1',
        shape: 'polygon',
        points: [
          [225, 50],  // 175 + 50px spacing
          [350, 50],
          [350, 175],
          [225, 175],
        ],
        dropZone: {
          top: 50,
          left: 225,
          width: 125,
          height: 125,
        },
        imageUrl: placeholderImage,
      },
    ],
  },
};

// Resizable panels demonstration
export const ResizablePanels: Story = {
  args: {
    ...baseArgs,
    panels: [
      // Left panel
      {
        id: '5',
        pageId: 'page-1',
        shape: 'polygon',
        points: [
          [50, 50],
          [375, 50],
          [375, 350],
          [50, 350],
        ],
        dropZone: {
          top: 50,
          left: 50,
          width: 325,
          height: 300,
        },
      },
      // Right panel
      {
        id: '6',
        pageId: 'page-1',
        shape: 'polygon',
        points: [
          [425, 50],
          [750, 50],
          [750, 350],
          [425, 350],
        ],
        dropZone: {
          top: 50,
          left: 425,
          width: 325,
          height: 300,
        },
      },
      // Bottom panel
      {
        id: '7',
        pageId: 'page-1',
        shape: 'polygon',
        points: [
          [50, 400],
          [750, 400],
          [750, 950],
          [50, 950],
        ],
        dropZone: {
          top: 400,
          left: 50,
          width: 700,
          height: 550,
        },
      },
    ],
  },
}; 