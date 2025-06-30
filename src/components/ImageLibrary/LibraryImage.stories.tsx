import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LibraryImage from './LibraryImage';
import { placeholderImage } from '../../assets/placeholder';

const meta: Meta<typeof LibraryImage> = {
  title: 'ImageLibrary/LibraryImage',
  component: LibraryImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Source URL of the image',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    isUsed: {
      control: 'boolean',
      description: 'Whether the image is currently used in a comic panel',
    },
    onDownload: {
      description: 'Callback function when download button is clicked',
    },
    onDelete: {
      description: 'Callback function when delete button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image',
    isUsed: false,
  },
};

export const UsedImage: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image that is used',
    isUsed: true,
  },
};

export const WithDownloadButton: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image with download button',
    isUsed: false,
    onDownload: () => console.log('Download clicked'),
  },
};

export const WithDeleteButton: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image with delete button',
    isUsed: false,
    onDelete: () => console.log('Delete clicked'),
  },
};

export const WithBothButtons: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image with both download and delete buttons',
    isUsed: false,
    onDownload: () => console.log('Download clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const UsedImageWithButtons: Story = {
  args: {
    src: placeholderImage,
    alt: 'Placeholder image that is used with action buttons',
    isUsed: true,
    onDownload: () => console.log('Download clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

// Grid layout to show multiple variations
export const AllVariations: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      padding: '20px',
      maxWidth: '800px'
    }}>
      <div style={{ height: '300px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="Default" 
        />
      </div>
      <div style={{ height: '300px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="Used" 
          isUsed={true}
        />
      </div>
      <div style={{ height: '300px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="With Download" 
          onDownload={() => console.log('Download clicked')}
        />
      </div>
      <div style={{ height: '300px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="With Delete" 
          onDelete={() => console.log('Delete clicked')}
        />
      </div>
      <div style={{ height: '300px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="With Both" 
          onDownload={() => console.log('Download clicked')}
          onDelete={() => console.log('Delete clicked')}
        />
      </div>
      <div style={{ height: '150px' }}>
        <LibraryImage 
          src={placeholderImage} 
          alt="Used with Both" 
          isUsed={true}
          onDownload={() => console.log('Download clicked')}
          onDelete={() => console.log('Delete clicked')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This story shows all variations of the LibraryImage component in a grid layout. Hover over the images to see the action buttons appear. All images are displayed as squares regardless of their original aspect ratio.',
      },
    },
  },
}; 