# SystemContextModal

A modal component for editing the system context that will be used for AI image generation.

## Features

- **Text Area Input**: Large text area for entering detailed system context
- **Form Validation**: Prevents submission of empty context
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Slide-in animation with backdrop blur
- **Keyboard Support**: Form submission with Enter key
- **Click Outside to Close**: Modal closes when clicking outside the content area

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls whether the modal is visible |
| `onClose` | `() => void` | Yes | Callback function when modal is closed |
| `onSubmit` | `(context: string) => void` | Yes | Callback function when form is submitted |
| `currentContext` | `string` | Yes | The current system context text to display |

## Usage

```tsx
import SystemContextModal from './SystemContextModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('');

  const handleSubmit = (newContext: string) => {
    setContext(newContext);
    setIsOpen(false);
  };

  return (
    <SystemContextModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
      currentContext={context}
    />
  );
}
```

## Styling

The modal uses styled-components with a modern design that includes:

- **Backdrop**: Semi-transparent overlay with blur effect
- **Container**: White background with rounded corners and shadow
- **Typography**: Orbitron font for headers, Roboto for body text
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive**: Adapts to mobile and desktop screen sizes

## Accessibility

- Proper ARIA labels and form associations
- Keyboard navigation support
- Focus management
- Screen reader friendly structure

## Integration with Redux

This component is designed to work with the Redux store's `systemContext` state. The context is typically managed through the `setSystemContext` action and accessed via the `selectSystemContext` selector. 