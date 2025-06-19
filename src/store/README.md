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

## AI Integration Flow

1. **User clicks "Enable AI" toggle** - If no API key exists, modal appears
2. **User enters API key** - Key is validated and stored in Redux
3. **AI is enabled** - Toggle switches to enabled state
4. **Future AI features** - Can access the API key via `selectApiKey` selector

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

### Type Safety
The store includes typed hooks:
- `useAppDispatch()` - Typed dispatch function
- `useAppSelector()` - Typed selector hook

## Next Steps

1. Test the Redux integration by uncommenting sections one at a time
2. Remove the old state management code once Redux is working
3. Add additional Redux features as needed
4. Consider adding Redux DevTools for debugging
5. Implement AI features that respond to the `aiEnabled` state and use the stored API key
6. Add API key validation and error handling
7. Consider adding API key encryption for enhanced security 