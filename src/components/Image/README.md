# Image Component

A reusable image component that provides consistent image display functionality across the application with optional full-screen expansion on click.

## Features

- **Flexible Sizing**: Customizable width and height
- **Object Fit Control**: Support for all CSS object-fit values
- **Border Radius**: Customizable border radius
- **Full-Screen Expansion**: Optional click-to-expand functionality with frosted background overlay
- **Custom Click Handlers**: Support for custom onClick handlers when not expandable
- **Hover Effects**: Subtle hover animations for expandable images
- **Accessibility**: Proper alt text and title support
- **Responsive**: Works well across different screen sizes

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | Yes | - | Source URL of the image |
| `alt` | `string` | Yes | - | Alt text for accessibility |
| `width` | `string \| number` | No | `'100%'` | Width of the image container |
| `height` | `string \| number` | No | `'auto'` | Height of the image container |
| `objectFit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | No | `'cover'` | CSS object-fit property |
| `borderRadius` | `string` | No | `'0'` | Border radius of the container |
| `expandable` | `boolean` | No | `false` | Whether image can be expanded to full screen |
| `className` | `string` | No | - | Additional CSS class name |
| `onClick` | `() => void` | No | - | Custom click handler (only when not expandable) |
| `title` | `string` | No | - | Title attribute for the image |

## Usage

### Basic Usage

```tsx
import Image from '../Image';

<Image 
  src="https://example.com/image.jpg" 
  alt="Example image" 
/>
```

### Expandable Image

```tsx
<Image 
  src="https://example.com/image.jpg" 
  alt="Expandable image"
  width="300px"
  height="200px"
  expandable={true}
  title="Click to view full resolution"
/>
```

### Custom Styling

```tsx
<Image 
  src="https://example.com/image.jpg" 
  alt="Styled image"
  width="200px"
  height="200px"
  borderRadius="8px"
  objectFit="contain"
  expandable={true}
/>
```

### Custom Click Handler

```tsx
<Image 
  src="https://example.com/image.jpg" 
  alt="Clickable image"
  expandable={false}
  onClick={() => console.log('Image clicked!')}
/>
```

## Full-Screen Overlay

When `expandable` is set to `true`, clicking the image opens a full-screen overlay with:

- **Frosted Background**: Semi-transparent dark background with blur effect
- **Centered Image**: Image scales to fit within 90% of viewport
- **Smooth Animations**: Fade-in/out and scale animations
- **Click to Close**: Click anywhere outside the image to close
- **High Z-Index**: Ensures overlay appears above other content

## Integration

This component is designed to replace image display functionality in:

- **AiImageModal**: For preview images with full-screen expansion
- **SystemContextModal**: For reference images with full-screen expansion  
- **LibraryImage**: As a wrapper for library images (with additional controls)

## Styling

The component uses styled-components and includes:

- **Responsive Design**: Adapts to different screen sizes
- **Smooth Transitions**: Hover effects and animations
- **Modern UI**: Clean, consistent styling
- **Accessibility**: Proper focus states and keyboard navigation 