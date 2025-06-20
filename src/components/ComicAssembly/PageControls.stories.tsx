import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PageControls from './PageControls';

const meta = {
  title: 'Comic/PageControls',
  component: PageControls,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '800px', 
        height: '200px', 
        position: 'relative',
        background: '#f0f0f0',
        borderRadius: '8px',
      }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PageControls>;

export default meta;
type Story = StoryObj<typeof PageControls>;

export const Default: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
  },
};

export const HighPageNumber: Story = {
  args: {
    displayNumber: 42,
    onDelete: () => console.log('Delete clicked'),
  },
};

export const OnDarkBackground: Story = {
  args: {
    displayNumber: 3,
    onDelete: () => console.log('Delete clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '800px', 
        height: '200px', 
        position: 'relative',
        background: '#333',
        borderRadius: '8px',
      }}>
        <Story />
      </div>
    ),
  ],
}; 