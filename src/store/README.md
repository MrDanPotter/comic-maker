# Redux Integration

This document describes the Redux integration for the Comic Maker application.

## Overview

The application has been integrated with Redux for state management. The Redux store is set up with two main slices:

1. **comicPagesSlice** - Manages comic pages and panels
2. **imageLibrarySlice** - Manages uploaded images

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

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const pages = useAppSelector(selectAllPages);
  
  const handleAddPage = () => {
    dispatch(addPage(newPage));
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