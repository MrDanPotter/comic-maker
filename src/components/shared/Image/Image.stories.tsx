import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Image from './Image';
import { placeholderImage, placeholderImageLarge } from '../../../assets/placeholder';

const meta: Meta<typeof Image> = {
  title: 'Components/Shared/Image',
  component: Image,
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
    width: {
      control: 'text',
      description: 'Width of the image container',
    },
    height: {
      control: 'text',
      description: 'Height of the image container',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'CSS object-fit property',
    },
    borderRadius: {
      control: 'text',
      description: 'Border radius of the image container',
    },
    expandOnClick: {
      control: 'boolean',
      description: 'Whether the image can be expanded to full screen on click',
    },
    onClick: {
      description: 'Callback function when image is clicked (only when not expandable)',
    },
    title: {
      control: 'text',
      description: 'Title attribute for the image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: placeholderImage,
    alt: 'Default image',
    width: '300px',
    height: '200px',
  },
};

export const Expandable: Story = {
  args: {
    src: placeholderImage,
    alt: 'Expandable image',
    width: '300px',
    height: '200px',
    expandOnClick: true,
    title: 'Click to view full resolution',
  },
  parameters: {
    docs: {
      description: {
        story: 'This image can be clicked to view in full resolution with a frosted background overlay.',
      },
    },
  },
};

export const SquareImage: Story = {
  args: {
    src: placeholderImage,
    alt: 'Square image',
    width: '200px',
    height: '200px',
    borderRadius: '8px',
    expandOnClick: true,
  },
};

export const ContainedFit: Story = {
  args: {
    src: placeholderImageLarge,
    alt: 'Image with contain object-fit',
    width: '300px',
    height: '200px',
    objectFit: 'contain',
    expandOnClick: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This image uses object-fit: contain to show the entire image within the container.',
      },
    },
  },
};

export const WithCustomClick: Story = {
  args: {
    src: placeholderImage,
    alt: 'Image with custom click handler',
    width: '300px',
    height: '200px',
    expandOnClick: false,
    onClick: () => alert('Image clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'This image has a custom click handler instead of full-screen expansion.',
      },
    },
  },
};

export const RoundedImage: Story = {
  args: {
    src: placeholderImage,
    alt: 'Rounded image',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    expandOnClick: true,
  },
};

// Grid layout to show multiple variations
export const AllVariations: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px', 
      padding: '20px',
      maxWidth: '1000px'
    }}>
      <div>
        <h4>Default</h4>
        <Image 
          src={placeholderImage} 
          alt="Default" 
          width="250px"
          height="150px"
        />
      </div>
      <div>
        <h4>Expandable</h4>
        <Image 
          src={placeholderImage} 
          alt="Expandable" 
          width="250px"
          height="150px"
          expandOnClick={true}
        />
      </div>
      <div>
        <h4>Square</h4>
        <Image 
          src={placeholderImage} 
          alt="Square" 
          width="150px"
          height="150px"
          borderRadius="8px"
          expandOnClick={true}
        />
      </div>
      <div>
        <h4>Contained</h4>
        <Image 
          src={placeholderImageLarge} 
          alt="Contained" 
          width="250px"
          height="150px"
          objectFit="contain"
          expandOnClick={true}
        />
      </div>
      <div>
        <h4>Rounded</h4>
        <Image 
          src={placeholderImage} 
          alt="Rounded" 
          width="150px"
          height="150px"
          borderRadius="50%"
          expandOnClick={true}
        />
      </div>
      <div>
        <h4>Custom Click</h4>
        <Image 
          src={placeholderImage} 
          alt="Custom Click" 
          width="250px"
          height="150px"
          expandOnClick={false}
          onClick={() => alert('Custom click!')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This story shows all variations of the Image component in a grid layout. Try clicking on the expandable images to see the full-screen overlay.',
      },
    },
  },
}; 