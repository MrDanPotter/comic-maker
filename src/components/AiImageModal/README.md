# AiImageModal Component

The AiImageModal component provides a user interface for generating AI images using OpenAI's DALL-E API. It features a modern two-column layout with the form on the left and image preview area on the right.

## Features

- **Two-Column Layout**: Form controls on the left, real-time preview on the right
- **Text Prompt Input**: Users can enter detailed descriptions of the images they want to generate
- **Aspect Ratio Control**: Supports various aspect ratios (1:1, 16:9, 4:3, etc.)
- **Real-time Generation**: Integrates with OpenAI's API for image generation
- **Live Preview**: Shows generated images immediately in the preview area
- **Responsive Design**: Works well on different screen sizes
- **Loading States**: Visual feedback during image generation

## Layout

The modal uses a two-column layout:

### Left Panel (Form)
- Modal header and aspect ratio information
- Text prompt input area
- Aspect ratio enforcement checkbox
- Action buttons (Cancel, Generate)
- Error messages

### Right Panel (Preview)
- Preview title that changes based on state
- Loading spinner during generation
- Generated image display
- "Use This Image" button when image is ready
- Placeholder when no image is generated

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Whether the modal is open or closed |
| `onClose` | `() => void` | Yes | Callback function when modal is closed |
| `onImageGenerated` | `(imageUrl: string) => void` | Yes | Callback function when an image is successfully generated |
| `aspectRatio` | `string` | Yes | The aspect ratio for the generated image (e.g., "1:1", "16:9") |
| `apiKey` | `string` | Yes | OpenAI API key for image generation |

## Usage

```tsx
import AiImageModal from '../AiImageModal';

<AiImageModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onImageGenerated={(imageUrl) => {
    console.log('Generated image:', imageUrl);
    // Handle the generated image
  }}
  aspectRatio="1:1"
  apiKey="your-openai-api-key"
/>
```

## Stories

The component includes comprehensive Storybook stories for development and testing:

- **Default**: Basic modal with square aspect ratio
- **Closed**: Modal in closed state
- **WideAspectRatio**: Modal configured for wide images (16:9)
- **TallAspectRatio**: Modal configured for portrait images (3:4)
- **SquareAspectRatio**: Modal configured for square images (1:1)
- **Interactive**: Interactive story for testing different aspect ratios
- **States**: Demonstrates different modal states (open, generating, preview)
- **TwoColumnLayout**: Showcases the new two-column layout design

## Integration

The AiImageModal is typically used in conjunction with:

- **DragDropLayer**: For generating images for specific comic panels
- **AiSparkleButton**: To trigger the modal from panel overlays
- **Image Library**: Generated images are automatically added to the library

## Styling

The component uses styled-components for styling and includes:

- **Two-column flexbox layout** with proper spacing
- **Smooth animations** and transitions
- **Responsive design** that adapts to different screen sizes
- **Modern UI** with gradients, shadows, and proper typography
- **Loading states** with animated spinners
- **Error handling** with styled error messages
- **Visual feedback** for different states (empty, loading, preview)

## Development

To modify the appearance or behavior:

1. Edit the styled components in `AiImageModal.tsx`
2. Test changes using the Storybook stories (especially the TwoColumnLayout story)
3. Update the stories if new props or states are added
4. Ensure the component remains accessible and responsive
5. Test the layout with different aspect ratios and content lengths 