import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import ComicPage from './components/ComicPage';
import ImageLibrary from './components/ImageLibrary';
import TemplateSelector from './components/TemplateSelector';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #e9ecef;
`;

const ComicContainer = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 300px; // Space for the template selector
  margin-right: 300px; // Space for the image library
  overflow-y: auto;
`;

const AddPageButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #388e3c;
  }
`;

interface ComicPanel {
  id: string;
  width: string;
  height: string;
  imageId?: string;
}

interface ComicPage {
  id: string;
  layout: ComicPanel[];
}

interface LibraryImage {
  id: string;
  url: string;
}

const layouts = {
  quadrant: [
    { id: '1', width: '48%', height: '48%' },
    { id: '2', width: '48%', height: '48%' },
    { id: '3', width: '48%', height: '48%' },
    { id: '4', width: '48%', height: '48%' },
  ],
  threePanel: [
    { id: '1', width: '100%', height: '60%' }, // Large top panel
    { id: '2', width: '48%', height: '38%' },  // Bottom left panel
    { id: '3', width: '48%', height: '38%' },  // Bottom right panel
  ],
  mangaStyle: [
    { id: '1', width: '60%', height: '60%' },  // Large main panel
    { id: '2', width: '38%', height: '48%' },  // Top right panel
    { id: '3', width: '38%', height: '48%' },  // Bottom right panel
    { id: '4', width: '48%', height: '38%' },  // Bottom left panel
  ],
  sixPanel: [
    { id: '1', width: '31%', height: '31%' },
    { id: '2', width: '31%', height: '31%' },
    { id: '3', width: '31%', height: '31%' },
    { id: '4', width: '31%', height: '31%' },
    { id: '5', width: '31%', height: '31%' },
    { id: '6', width: '31%', height: '31%' },
  ]
};

type LayoutType = keyof typeof layouts;

const defaultPageLayout = layouts.quadrant;

function App() {
  const [pages, setPages] = useState<ComicPage[]>([
    { id: '1', layout: [...layouts.quadrant] },
  ]);
  const [images, setImages] = useState<LibraryImage[]>([]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const destId = result.destination.droppableId;
    const imageId = result.draggableId;

    // Only handle drops into comic panels
    if (destId.includes('-')) {
      const [destPageId, destPanelId] = destId.split('-');
      
      setPages(prevPages => {
        return prevPages.map(page => {
          if (page.id === destPageId) {
            return {
              ...page,
              layout: page.layout.map(panel => {
                if (panel.id === destPanelId) {
                  return { ...panel, imageId };
                }
                return panel;
              }),
            };
          }
          return page;
        });
      });
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const newImage: LibraryImage = {
          id: `image-${Date.now()}`,
          url: e.target.result as string,
        };
        setImages(prev => [...prev, newImage]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTemplateSelect = (templateName: keyof typeof layouts) => {
    const newPage: ComicPage = {
      id: `page-${pages.length + 1}`,
      layout: [...layouts[templateName]],
    };
    setPages(prev => [...prev, newPage]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <AppContainer>
        <TemplateSelector onTemplateSelect={handleTemplateSelect} templates={layouts} />
        <ComicContainer>
          {pages.map(page => (
            <ComicPage key={page.id} pageId={page.id} layout={page.layout} />
          ))}
        </ComicContainer>
        <ImageLibrary onImageUpload={handleImageUpload} images={images} />
      </AppContainer>
    </DragDropContext>
  );
}

export default App;
