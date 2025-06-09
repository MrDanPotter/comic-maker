import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import styled from 'styled-components';
import ComicPage from './components/ComicAssembly/ComicPage';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import TemplateSelector from './components/TemplateSelector/TemplateSelector';
import { Panel } from './types/comic';
import { 
  fullPageLayout,
  widePageLayout,
  twoByThreeLayout,
  leftTallRightSquaresLayout,
  rightTallLeftSquaresLayout,
  topTallBottomSquaresLayout,
  bottomTallTopSquaresLayout,
  threeVerticalPanelsLayout,
  threeHorizontalPanelsLayout,
  twoVerticalPanelsLayout,
  twoHorizontalPanelsLayout,
  twoByTwoLayout
} from './utils/layouts';

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

interface ComicPage {
  id: string;
  panels: Panel[];
}

interface LibraryImage {
  id: string;
  url: string;
  isPlaced?: boolean;
}

type LayoutType = 
  | "fullPage"
  | "widePage" 
  | "twoByThree"
  | "twoByTwo"
  | "leftTallRightSquares" 
  | "rightTallLeftSquares"
  | "topTallBottomSquares"
  | "bottomTallTopSquares"
  | "threeVerticalPanels"
  | "threeHorizontalPanels"
  | "twoVerticalPanels"
  | "twoHorizontalPanels";

const layouts: Record<LayoutType, () => Panel[]> = {
  fullPage: fullPageLayout,
  widePage: widePageLayout,
  twoByThree: twoByThreeLayout,
  twoByTwo: twoByTwoLayout,
  leftTallRightSquares: leftTallRightSquaresLayout,
  rightTallLeftSquares: rightTallLeftSquaresLayout,
  topTallBottomSquares: topTallBottomSquaresLayout,
  bottomTallTopSquares: bottomTallTopSquaresLayout,
  threeVerticalPanels: threeVerticalPanelsLayout,
  threeHorizontalPanels: threeHorizontalPanelsLayout,
  twoVerticalPanels: twoVerticalPanelsLayout,
  twoHorizontalPanels: twoHorizontalPanelsLayout
};

const defaultPageLayout = layouts.fullPage;

function App() {
  const [pages, setPages] = useState<ComicPage[]>([
    { id: "1", panels: defaultPageLayout() },
  ]);
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [draggedImageUrl, setDraggedImageUrl] = useState<string | null>(null);

  const handleMovePageUp = (pageIndex: number) => {
    if (pageIndex > 0) {
      setPages(prevPages => {
        const newPages = [...prevPages];
        [newPages[pageIndex - 1], newPages[pageIndex]] = [newPages[pageIndex], newPages[pageIndex - 1]];
        return newPages;
      });
    }
  };

  const handleMovePageDown = (pageIndex: number) => {
    if (pageIndex < pages.length - 1) {
      setPages(prevPages => {
        const newPages = [...prevPages];
        [newPages[pageIndex], newPages[pageIndex + 1]] = [newPages[pageIndex + 1], newPages[pageIndex]];
        return newPages;
      });
    }
  };

  const handleDeletePage = (pageId: string) => {
    setPages(prevPages => prevPages.filter(page => page.id !== pageId));
  };

  const handleDragStart = (result: any) => {
    const imageId = result.draggableId;
    const draggedImage = images.find(img => img.id === imageId);
    if (draggedImage) {
      setDraggedImageUrl(draggedImage.url);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedImageUrl(null);
    if (!result.destination) return;

    const destId = result.destination.droppableId;
    const imageId = result.draggableId;

    // Only handle drops into comic panels
    if (destId.includes('-')) {
      // Get the full panel ID by taking everything after the first dash
      const destPageId = destId.split('-')[0];
      const destPanelId = destId.substring(destId.indexOf('-') + 1);
     
      // Find the image that was dragged
      const draggedImage = images.find(img => img.id === imageId);
      if (!draggedImage) {
        console.warn('Image not found:', imageId);
        return;
      }

      // Update the image's placed status
      setImages(prevImages => prevImages.map(img => 
        img.id === imageId ? { ...img, isPlaced: true } : img
      ));

      // Update the panel with the image URL
      setPages(prevPages => {
        const updatedPages = prevPages.map(page => {
          if (page.id === destPageId) {
            return {
              ...page,
              panels: page.panels.map(panel => {
                if (panel.id === destPanelId) {
                  return { ...panel, imageUrl: draggedImage.url };
                }
                return panel;
              }),
            };
          }
          return page;
        });

        return updatedPages;
      });
    }
  };

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImage: LibraryImage = {
            id: `image-${Date.now()}-${file.name}`,
            url: e.target.result as string,
          };
          setImages(prev => [...prev, newImage]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTemplateSelect = (templateName: LayoutType) => {
    const pageNumber = pages.length + 1;
    const newPage: ComicPage = {
      id: pageNumber.toString(),
      panels: layouts[templateName](),
    };
    setPages(prev => [...prev, newPage]);
    console.log('Added new page:', newPage.id);
  };

  return (
    <DragDropContext 
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <AppContainer>
        <TemplateSelector onTemplateSelect={handleTemplateSelect} templates={layouts} />
        <ComicContainer>
          {pages.map((page, index) => (
            <ComicPage
              key={page.id}
              pageId={page.id}
              displayNumber={index + 1}
              panels={page.panels}
              onDelete={() => handleDeletePage(page.id)}
              onMoveUp={() => handleMovePageUp(index)}
              onMoveDown={() => handleMovePageDown(index)}
              isFirstPage={index === 0}
              isLastPage={index === pages.length - 1}
              draggedImageUrl={draggedImageUrl}
            />
          ))}
        </ComicContainer>
        <ImageLibrary onImageUpload={handleImageUpload} images={images} />
      </AppContainer>
    </DragDropContext>
  );
}

export default App;

