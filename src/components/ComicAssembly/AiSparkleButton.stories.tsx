import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AiSparkleButton from './AiSparkleButton';

const meta = {
  title: 'Comic Builder/AiSparkleButton',
  component: AiSparkleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    isVisible: {
      control: { type: 'boolean' },
      description: 'Controls whether the button is visible'
    }
  },
} satisfies Meta<typeof AiSparkleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base args for SVG version
const baseArgs = {
  onClick: () => console.log('AI Sparkle Button clicked!'),
  isVisible: true,
  x: 50,
  y: 50,
};

// HTML Version Stories
export const Default: Story = {
  args: baseArgs,
};

export const Hidden: Story = {
  args: {
    ...baseArgs,
    isVisible: false,
  },
};

export const Interactive: Story = {
  args: baseArgs,
  render: (args) => {
    const [isVisible, setIsVisible] = React.useState(false);
    
    return (
      <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Visibility
          </button>
          <span>Button is {isVisible ? 'visible' : 'hidden'}</span>
        </div>
        <div style={{ position: 'relative', width: '200px', height: '100px', background: 'white', border: '1px solid #ccc' }}>
          <AiSparkleButton
            {...args}
            isVisible={isVisible}
            onClick={() => {
              args.onClick();
              setIsVisible(false);
            }}
          />
        </div>
      </div>
    );
  },
};

// SVG Version Stories
export const SvgVersion: Story = {
  args: baseArgs,
  render: (args) => (
    <svg width="400" height="300" style={{ border: '1px solid #ccc', background: 'white' }}>
      <AiSparkleButton
        x={50}
        y={50}
        onClick={() => console.log('SVG AI Button clicked!')}
        isVisible={true}
      />
      <AiSparkleButton
        x={150}
        y={50}
        onClick={() => console.log('SVG AI Button 2 clicked!')}
        isVisible={false}
      />
      <AiSparkleButton
        x={250}
        y={50}
        onClick={() => console.log('SVG AI Button 3 clicked!')}
        isVisible={true}
        size={60}
      />
    </svg>
  ),
};

export const SvgVersionInteractive: Story = {
  args: baseArgs,
  render: () => {
    const [visibleButtons, setVisibleButtons] = React.useState([true, false, true]);
    
    const toggleButton = (index: number) => {
      const newVisible = [...visibleButtons];
      newVisible[index] = !newVisible[index];
      setVisibleButtons(newVisible);
    };
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => toggleButton(0)}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Button 1
          </button>
          <button 
            onClick={() => toggleButton(1)}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Button 2
          </button>
          <button 
            onClick={() => toggleButton(2)}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Button 3
          </button>
        </div>
        <svg width="400" height="300" style={{ border: '1px solid #ccc', background: 'white' }}>
          <AiSparkleButton
            x={50}
            y={50}
            onClick={() => console.log('SVG AI Button 1 clicked!')}
            isVisible={visibleButtons[0]}
          />
          <AiSparkleButton
            x={150}
            y={50}
            onClick={() => console.log('SVG AI Button 2 clicked!')}
            isVisible={visibleButtons[1]}
          />
          <AiSparkleButton
            x={250}
            y={50}
            onClick={() => console.log('SVG AI Button 3 clicked!')}
            isVisible={visibleButtons[2]}
            size={60}
          />
        </svg>
      </div>
    );
  },
};

export const SvgVersionInContext: Story = {
  args: baseArgs,
  render: () => (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h3 style={{ marginBottom: '20px' }}>AI Sparkle Button in Comic Panel Context</h3>
      <svg width="600" height="400" style={{ border: '1px solid #ccc', background: 'white' }}>
        {/* Simulate a comic panel */}
        <rect x="50" y="50" width="200" height="150" fill="#f5f5f5" stroke="#333" strokeWidth="2" />
        <text x="60" y="80" fontSize="14" fill="#666">Comic Panel 1</text>
        
        {/* AI Sparkle Button positioned in top-right of panel */}
        <AiSparkleButton
          x={210}
          y={58}
          onClick={() => console.log('Panel 1 AI Button clicked!')}
          isVisible={true}
        />
        
        {/* Second panel */}
        <rect x="300" y="50" width="200" height="150" fill="#f5f5f5" stroke="#333" strokeWidth="2" />
        <text x="310" y="80" fontSize="14" fill="#666">Comic Panel 2</text>
        
        {/* AI Sparkle Button for second panel */}
        <AiSparkleButton
          x={460}
          y={58}
          onClick={() => console.log('Panel 2 AI Button clicked!')}
          isVisible={true}
        />
        
        {/* Third panel (bottom) */}
        <rect x="50" y="250" width="450" height="100" fill="#f5f5f5" stroke="#333" strokeWidth="2" />
        <text x="60" y="280" fontSize="14" fill="#666">Comic Panel 3 (Wide)</text>
        
        {/* AI Sparkle Button for third panel */}
        <AiSparkleButton
          x={470}
          y={258}
          onClick={() => console.log('Panel 3 AI Button clicked!')}
          isVisible={true}
        />
      </svg>
    </div>
  ),
};

export const DifferentSizes: Story = {
  args: baseArgs,
  render: () => (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>AI Sparkle Buttons with Different Sizes</h3>
      <svg width="500" height="200" style={{ border: '1px solid #ccc', background: 'white' }}>
        <AiSparkleButton
          x={50}
          y={50}
          onClick={() => console.log('Small button clicked!')}
          isVisible={true}
          size={30}
        />
        <text x="50" y="100" fontSize="12" fill="#666">Size: 30</text>
        
        <AiSparkleButton
          x={150}
          y={50}
          onClick={() => console.log('Medium button clicked!')}
          isVisible={true}
          size={40}
        />
        <text x="150" y="100" fontSize="12" fill="#666">Size: 40 (default)</text>
        
        <AiSparkleButton
          x={250}
          y={50}
          onClick={() => console.log('Large button clicked!')}
          isVisible={true}
          size={50}
        />
        <text x="250" y="100" fontSize="12" fill="#666">Size: 50</text>
        
        <AiSparkleButton
          x={350}
          y={50}
          onClick={() => console.log('Extra large button clicked!')}
          isVisible={true}
          size={60}
        />
        <text x="350" y="100" fontSize="12" fill="#666">Size: 60</text>
      </svg>
    </div>
  ),
}; 