import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';
import PageControls from './PageControls';

const meta = {
  title: 'Comic Builder/PageControls',
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
  argTypes: {
    displayNumber: {
      control: 'number',
      description: 'The page number to display',
    },
    onDelete: {
      description: 'Callback function when delete button is clicked',
    },
    onMoveUp: {
      description: 'Callback function when move up button is clicked',
    },
    onMoveDown: {
      description: 'Callback function when move down button is clicked',
    },
    onRotate: {
      description: 'Callback function when rotate button is clicked',
    },
    onMirror: {
      description: 'Callback function when mirror button is clicked',
    },
    isFirstPage: {
      control: 'boolean',
      description: 'Whether this is the first page (hides move up button)',
    },
    isLastPage: {
      control: 'boolean',
      description: 'Whether this is the last page (hides move down button)',
    },
  },
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

// Stories showcasing different icon combinations
export const WithMoveUpDown: Story = {
  args: {
    displayNumber: 2,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page controls with move up and down arrows visible.',
      },
    },
  },
};

export const WithRotate: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onRotate: () => console.log('Rotate clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page controls with rotate button (blue circular arrow icon).',
      },
    },
  },
};

export const WithMirror: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page controls with mirror button (purple repeat icon).',
      },
    },
  },
};

export const WithRotateAndMirror: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page controls with both rotate and mirror buttons.',
      },
    },
  },
};

export const AllControls: Story = {
  args: {
    displayNumber: 3,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page controls with all possible buttons: move up, move down, rotate, mirror, and delete.',
      },
    },
  },
};

// Stories showcasing edge cases
export const FirstPage: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
    isFirstPage: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'First page - move up button is hidden.',
      },
    },
  },
};

export const LastPage: Story = {
  args: {
    displayNumber: 5,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
    isLastPage: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Last page - move down button is hidden.',
      },
    },
  },
};

export const SinglePage: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
    isFirstPage: true,
    isLastPage: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single page - both move up and move down buttons are hidden.',
      },
    },
  },
};

// Stories showcasing different page numbers
export const PageOne: Story = {
  args: {
    displayNumber: 1,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page 1 with all controls.',
      },
    },
  },
};

export const PageTen: Story = {
  args: {
    displayNumber: 10,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page 10 with all controls.',
      },
    },
  },
};

export const PageHundred: Story = {
  args: {
    displayNumber: 100,
    onDelete: () => console.log('Delete clicked'),
    onMoveUp: () => console.log('Move up clicked'),
    onMoveDown: () => console.log('Move down clicked'),
    onRotate: () => console.log('Rotate clicked'),
    onMirror: () => console.log('Mirror clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Page 100 with all controls - shows how larger numbers are handled.',
      },
    },
  },
};

// Interactive story to test different combinations
export const Interactive: Story = {
  render: () => {
    const [pageNumber, setPageNumber] = React.useState(3);
    const [isFirst, setIsFirst] = React.useState(false);
    const [isLast, setIsLast] = React.useState(false);
    const [showMoveUp, setShowMoveUp] = React.useState(true);
    const [showMoveDown, setShowMoveDown] = React.useState(true);
    const [showRotate, setShowRotate] = React.useState(true);
    const [showMirror, setShowMirror] = React.useState(true);
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>
              Page Number:
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                style={{ marginLeft: '5px', width: '60px' }}
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={isFirst}
                onChange={(e) => setIsFirst(e.target.checked)}
              />
              First Page
            </label>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={isLast}
                onChange={(e) => setIsLast(e.target.checked)}
              />
              Last Page
            </label>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={showMoveUp}
                onChange={(e) => setShowMoveUp(e.target.checked)}
              />
              Show Move Up
            </label>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={showMoveDown}
                onChange={(e) => setShowMoveDown(e.target.checked)}
              />
              Show Move Down
            </label>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={showRotate}
                onChange={(e) => setShowRotate(e.target.checked)}
              />
              Show Rotate
            </label>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={showMirror}
                onChange={(e) => setShowMirror(e.target.checked)}
              />
              Show Mirror
            </label>
          </div>
        </div>
        
        <div style={{ 
          width: '800px', 
          height: '200px', 
          position: 'relative',
          background: '#f0f0f0',
          borderRadius: '8px',
          margin: '0 auto'
        }}>
          <PageControls
            displayNumber={pageNumber}
            onDelete={() => console.log('Delete clicked')}
            onMoveUp={showMoveUp ? () => console.log('Move up clicked') : undefined}
            onMoveDown={showMoveDown ? () => console.log('Move down clicked') : undefined}
            onRotate={showRotate ? () => console.log('Rotate clicked') : undefined}
            onMirror={showMirror ? () => console.log('Mirror clicked') : undefined}
            isFirstPage={isFirst}
            isLastPage={isLast}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story to test different combinations of page controls. Use the controls above to toggle different options and see how the component adapts.',
      },
    },
  },
}; 