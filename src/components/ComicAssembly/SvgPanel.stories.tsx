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

// Single empty panel
export const EmptyPanel: Story = {
  args: {
    panels: [{
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
    }],
    pageId: 'page-1',
  },
};

// Single panel with a placeholder image
export const WithImage: Story = {
  args: {
    panels: [{
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
    }],
    pageId: 'page-1',
  },
};

// Multiple panels with different shapes
export const MultiplePanels: Story = {
  args: {
    panels: [
      {
        id: '3',
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
    pageId: 'page-1',
  },
}; 