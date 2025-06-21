# Redux Integration

This document describes the Redux integration for the Comic Maker application.

## Overview

The application has been integrated with Redux for state management. The Redux store is set up with three main slices:

1. **comicPagesSlice** - Manages comic pages and panels
2. **imageLibrarySlice** - Manages uploaded images
3. **appStateSlice** - Manages application-wide state (AI toggle, API key, etc.)

## Store Structure

### Comic Pages State
```typescript
interface ComicPagesState {
  pages: ComicPage[];
  currentPageId: string | null;
}
```

### Image Library State
```typescript
interface ImageLibraryState {
  images: Image[];
}
```

### App State
```typescript
interface AppState {
  aiEnabled: boolean;
  apiKey: string | null;
  showApiKeyModal: boolean;
  systemContext: string;
  useOpenAIImageGeneration: boolean;
}
```

## Actions

### Comic Pages Actions
- `addPage(page: ComicPage)` - Add a new comic page
- `removePage(pageId: string)` - Remove a comic page
- `reorderPages(pages: ComicPage[])` - Reorder comic pages
- `setCurrentPage(pageId: string | null)` - Set the current active page
- `updatePanel({ pageId, panelId, updates })` - Update a panel's properties
- `setPanelImage({ pageId, panelId, imageUrl })` - Set an image for a panel

### Image Library Actions
- `addImage(image: Image)` - Add a new image to the library
- `removeImage(imageId: string)` - Remove an image from the library
- `markImageAsUsed({ imageId, panelId })` - Mark an image as used in a panel
- `markImageAsUnused({ imageId, panelId })` - Mark an image as unused in a panel

### App State Actions
- `toggleAi()` - Toggle the AI enabled state (shows modal if no API key)
- `setAiEnabled(enabled: boolean)` - Set the AI enabled state
- `setApiKey(apiKey: string)` - Set the OpenAI API key and enable AI
- `showApiKeyModal()` - Show the API key input modal
- `hideApiKeyModal()` - Hide the API key input modal
- `clearApiKey()` - Clear the API key and disable AI
- `setSystemContext(context: string)` - Set the system context for AI image generation
- `setUseOpenAIImageGeneration(useOpenAI: boolean)` - Set whether to use OpenAI or Picsum for image generation

## Selectors

### Comic Pages Selectors
- `selectAllPages` - Get all comic pages
- `selectCurrentPageId` - Get the current page ID
- `selectPageById` - Get a specific page by ID
- `selectPanelById` - Get a specific panel by page and panel ID

### Image Library Selectors
- `selectAllImages` - Get all images
- `selectImageById` - Get a specific image by ID
- `selectUsedImages` - Get all used images
- `selectUnusedImages` - Get all unused images

### App State Selectors
- `selectAiEnabled` - Get the AI enabled state
- `selectApiKey` - Get the stored API key
- `selectShowApiKeyModal` - Get the modal visibility state
- `selectSystemContext` - Get the system context for AI image generation
- `selectUseOpenAIImageGeneration` - Get whether OpenAI image generation is enabled

## Components

### Header Component
The application includes a fixed header component (`src/components/Header/Header.tsx`) that features:

- **App Title**: "Comic Maker" with Orbitron font styling
- **AI Toggle**: A toggle switch to enable/disable AI features
- **Responsive Design**: Adapts to mobile and desktop layouts
- **Redux Integration**: Connected to the app state slice

### AI Key Modal Component
The application includes a modal component (`src/components/Header/AiKeyModal.tsx`) that features:

- **Modal Header**: "Bring Your Own Key" with Orbitron font
- **API Key Input**: Password field for entering OpenAI API key
- **Instructional Text**: Clear instructions for obtaining and using API keys
- **Submit Button**: Disabled until text is entered in the input field
- **Cancel Button**: Closes the modal without saving
- **Form Validation**: Prevents submission of empty keys
- **Responsive Design**: Works on both desktop and mobile

### AI Image Generation Components

#### AI Sparkle Button (`src/components/ComicAssembly/AiSparkleButton.tsx`)
- **Appearance**: Sparkle icon button that appears on panel hover when AI is enabled
- **Animation**: Smooth fade-in/out with sparkle animation effect
- **Positioning**: Top-right corner of each panel
- **Interaction**: Click to open AI image generation modal

#### AI Image Modal (`src/components/ComicAssembly/AiImageModal.tsx`)
- **Prompt Input**: Large text area for describing the desired image
- **Aspect Ratio Checkbox**: Option to enforce panel aspect ratio
- **Generate Button**: Submits the request to OpenAI API
- **Loading State**: Shows spinner during generation
- **Preview Section**: Displays generated image with "Use This Image" button
- **Error Handling**: Shows error messages if generation fails

#### AI Enhanced SVG Panel (`src/components/ComicAssembly/AiEnhancedSvgPanel.tsx`)
- **Wrapper Component**: Enhances the base SvgPanel with AI functionality
- **Hover Detection**: Shows sparkle buttons when hovering over panels
- **Modal Management**: Handles AI image generation modal state
- **Aspect Ratio Calculation**: Automatically calculates panel aspect ratios

## Services

### Image Generator Service (`src/services/imageGeneratorService.ts`)
- **Interface**: `ImageGeneratorService` provides a common interface for image generation
- **PicsumImageGenerationService**: Uses Picsum Photos for placeholder images (no API key required)
- **OpenAIImageGenerationService**: Uses OpenAI's DALL-E API for AI-generated images (requires API key)
- **Factory Function**: `createImageGeneratorService(useOpenAI: boolean)` creates the appropriate service
- **Type Safety**: TypeScript interfaces for requests and responses
- **Error Handling**: Comprehensive error handling for API calls

## AI Integration Flow

1. **User clicks "Enable AI" toggle** - If no API key exists, modal appears
2. **User enters API key** - Key is validated and stored in Redux
3. **AI is enabled** - Toggle switches to enabled state
4. **User hovers over panel** - Sparkle button appears
5. **User clicks sparkle button** - AI image generation modal opens
6. **User enters prompt** - Describes the desired image
7. **User clicks Generate** - Request is sent to OpenAI API
8. **Image is generated** - Preview is shown with option to use
9. **User clicks "Use This Image"** - Image is applied to the panel

## Migration Process

The Redux integration has been implemented with a migration-friendly approach:

1. **Redux Provider** - The app is wrapped with Redux Provider in `src/index.tsx`
2. **Commented Code** - All new Redux code is commented out with clear markers
3. **Existing Code** - All existing state management code is marked for deletion
4. **Gradual Migration** - You can uncomment Redux code section by section

## Testing Individual Sections

To test each section individually:

1. **Initialize Redux Store** - Uncomment the Redux initialization code in `App.tsx`
2. **Page Management** - Uncomment the Redux version of page management handlers
3. **Image Management** - Uncomment the Redux version of image management handlers
4. **Drag and Drop** - Uncomment the Redux version of drag and drop handlers
5. **UI Rendering** - Uncomment the Redux version of JSX rendering
6. **AI Features** - Test AI toggle, API key modal, and image generation

## Usage

### In Components
```typescript
import { useAppDispatch, useAppSelector } from '../store/store';
import { selectAllPages, addPage } from '../store/slices/comicPagesSlice';
import { selectAiEnabled, toggleAi, selectApiKey } from '../store/slices/appStateSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector(selectAllPages);
  const aiEnabled = useAppSelector(selectAiEnabled);
  const apiKey = useAppSelector(selectApiKey);
  
  const handleAddPage = () => {
    dispatch(addPage(newPage));
  };
  
  const handleToggleAi = () => {
    dispatch(toggleAi());
  };
  
  return <div>{/* component JSX */}</div>;
};
```

### AI Image Generation
```typescript
import { createImageGeneratorService } from '../services/imageGeneratorService';

const handleGenerateImage = async (prompt: string, aspectRatio: string, apiKey: string, useOpenAI: boolean) => {
  const imageService = createImageGeneratorService(useOpenAI);
  const response = await imageService.generateImage({ prompt, aspectRatio, apiKey });
  if (response.success) {
    // Use response.imageUrl
  }
};
```

### Type Safety
The store includes typed hooks:
- `useAppDispatch()` - Typed dispatch function
- `useAppSelector()` - Typed selector hook

## Next Steps

1. Test the Redux integration by uncommenting sections one at a time
2. Remove the old state management code once Redux is working
3. Add additional Redux features as needed
4. Consider adding Redux DevTools for debugging
5. Implement actual OpenAI API calls in the service
6. Add API key validation and error handling
7. Consider adding API key encryption for enhanced security
8. Add more AI features like text generation, story suggestions, etc. 