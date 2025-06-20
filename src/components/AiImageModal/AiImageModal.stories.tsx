import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import AiImageModal from './AiImageModal';

const meta: Meta<typeof AiImageModal> = {
  title: 'Components/AiImageModal',
  component: AiImageModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open or closed',
    },
    aspectRatio: {
      control: 'text',
      description: 'The aspect ratio for the generated image (e.g., "1:1", "16:9", "4:3")',
    },
    apiKey: {
      control: 'text',
      description: 'OpenAI API key for image generation',
    },
    onClose: {
      description: 'Callback function when modal is closed',
    },
    onImageGenerated: {
      description: 'Callback function when an image is successfully generated',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock API key for testing
const mockApiKey = 'sk-test-1234567890abcdef';

export const Default: Story = {
  args: {
    isOpen: true,
    aspectRatio: '1:1',
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string) => console.log('Image generated:', imageUrl),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    aspectRatio: '1:1',
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string) => console.log('Image generated:', imageUrl),
  },
};

export const WideAspectRatio: Story = {
  args: {
    isOpen: true,
    aspectRatio: '16:9',
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string) => console.log('Image generated:', imageUrl),
  },
};

export const TallAspectRatio: Story = {
  args: {
    isOpen: true,
    aspectRatio: '3:4',
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string) => console.log('Image generated:', imageUrl),
  },
};

export const SquareAspectRatio: Story = {
  args: {
    isOpen: true,
    aspectRatio: '1:1',
    apiKey: mockApiKey,
    onClose: () => console.log('Modal closed'),
    onImageGenerated: (imageUrl: string) => console.log('Image generated:', imageUrl),
  },
};

// Interactive story that allows toggling the modal
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setIsOpen(true)}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Open AI Image Modal
          </button>
          
          <select 
            value={aspectRatio} 
            onChange={(e) => setAspectRatio(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="1:1">Square (1:1)</option>
            <option value="16:9">Wide (16:9)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="3:4">Portrait (3:4)</option>
            <option value="2:1">Ultra Wide (2:1)</option>
          </select>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          Current aspect ratio: {aspectRatio}
        </div>
        
        <AiImageModal
          isOpen={isOpen}
          aspectRatio={aspectRatio}
          apiKey={mockApiKey}
          onClose={() => setIsOpen(false)}
          onImageGenerated={(imageUrl: string) => {
            console.log('Image generated:', imageUrl);
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'This interactive story allows you to open the AI Image Modal and test different aspect ratios. The modal will appear when you click the "Open AI Image Modal" button.',
      },
    },
  },
};

// Story showing different states
export const States: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<'closed' | 'open' | 'generating' | 'preview'>('closed');
    const [prompt, setPrompt] = useState('A beautiful sunset over mountains');
    
    const handleGenerate = async () => {
      setCurrentState('generating');
      // Simulate API call
      setTimeout(() => {
        setCurrentState('preview');
      }, 2000);
    };
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setCurrentState('open')}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              background: currentState === 'open' ? '#4caf50' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Modal
          </button>
          
          <button 
            onClick={() => setCurrentState('generating')}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              background: currentState === 'generating' ? '#ff9800' : '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Generating
          </button>
          
          <button 
            onClick={() => setCurrentState('preview')}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              background: currentState === 'preview' ? '#4caf50' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Preview
          </button>
          
          <button 
            onClick={() => setCurrentState('closed')}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Current state: {currentState}
        </div>
        
        <AiImageModal
          isOpen={currentState !== 'closed'}
          aspectRatio="1:1"
          apiKey={mockApiKey}
          onClose={() => setCurrentState('closed')}
          onImageGenerated={(imageUrl: string) => {
            console.log('Image generated:', imageUrl);
            setCurrentState('closed');
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates different states of the AI Image Modal: closed, open, generating, and preview. Use the buttons to cycle through the states.',
      },
    },
  },
};

// Story showing the two-column layout with different content
export const TwoColumnLayout: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              padding: '12px 24px',
              background: isOpen ? '#f44336' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            {isOpen ? 'Close Modal' : 'Open Modal'}
          </button>
          
          <select 
            value={aspectRatio} 
            onChange={(e) => setAspectRatio(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="1:1">Square (1:1)</option>
            <option value="16:9">Wide (16:9)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="3:4">Portrait (3:4)</option>
          </select>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Two-column layout with aspect ratio: {aspectRatio}
        </div>
        
        <AiImageModal
          isOpen={isOpen}
          aspectRatio={aspectRatio}
          apiKey={mockApiKey}
          onClose={() => setIsOpen(false)}
          onImageGenerated={(imageUrl: string) => {
            console.log('Image generated:', imageUrl);
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'This story showcases the new two-column layout with the form on the left and preview area on the right. Try different aspect ratios to see how the layout adapts.',
      },
    },
  },
}; 