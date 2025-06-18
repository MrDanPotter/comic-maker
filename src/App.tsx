import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import styled from 'styled-components';
import ComicPage from './components/ComicAssembly/ComicPage';
import ImageLibrary from './components/ImageLibrary/ImageLibrary';
import TemplateSelector from './components/TemplateSelector/TemplateSelector';
import { Panel } from './types/comic';
import { ComicPage as ComicPageType } from './types/comic';
import { 
  fullPageLayout,
  widePageLayout,
  sixPanelsLayout,
  fourPanelsLayout,
  oneBigTwoSmallLayout,
  threePanelsLayout,
  twoPanelsLayout,
  threePanelActionLayout,
  rotatePanels,
  mirrorPanels
} from './utils/layouts';

const AppContainer = styled.div<{ $isResponsive: boolean }>`
  display: flex;
  min-height: 100vh;
  background: #e9ecef;
  flex-direction: ${props => props.$isResponsive ? 'column' : 'row'};
`;

const ComicContainer = styled.div<{ $isResponsive: boolean }>`
  flex: 1;
  padding: 20px;
  margin-left: ${props => props.$isResponsive ? '0' : '300px'};
  margin-right: ${props => props.$isResponsive ? '0' : '300px'};
  margin-bottom: ${props => props.$isResponsive ? '100px' : '0'};
  overflow-y: auto;
`;

const DesktopSidePanels = styled.div<{ $isResponsive: boolean }>`
  display: ${props => props.$isResponsive ? 'none' : 'flex'};
`;

const BottomPanel = styled.div<{ $isResponsive: boolean; $isVisible: boolean }>`
  display: ${props => props.$isResponsive ? 'block' : 'none'};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f0f0f0;
  border-top: 1px solid #ddd;
  height: ${props => props.$isVisible ? '300px' : '60px'};
  transition: height 0.3s ease;
  z-index: 10;
`;

const BottomControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px 20px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  background: ${props => props.$isActive ? '#2196f3' : '#fff'};
  color: ${props => props.$isActive ? '#fff' : '#333'};
  border: 2px solid #2196f3;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isActive ? '#1976d2' : '#e3f2fd'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ResponsivePanelContainer = styled.div<{ $isVisible: boolean }>`
  height: ${props => props.$isVisible ? 'calc(100% - 60px)' : '0'};
  overflow: hidden;
  transition: height 0.3s ease;
`;

const HorizontalScrollContainer = styled.div`
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 20px;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ResponsiveTemplateSelector = styled.div`
  display: flex;
  gap: 15px;
  height: 100%;
  min-width: min-content;
`;

const ResponsiveImageLibrary = styled.div`
  min-width: 300px;
  height: 100%;
`;

interface LibraryImage {
  id: string;
  url: string;
  isPlaced?: boolean;
}

type LayoutType = 
  | "fullPage"
  | "widePage" 
  | "sixPanels"
  | "fourPanels"
  | "oneBigTwoSmall"
  | "threePanels"
  | "twoPanels"
  | "threePanelAction";

type ResponsivePanel = 'none' | 'templates' | 'images';

const layouts: Record<LayoutType, () => Panel[]> = {
  fullPage: fullPageLayout,
  widePage: widePageLayout,
  sixPanels: sixPanelsLayout,
  fourPanels: fourPanelsLayout,
  oneBigTwoSmall: oneBigTwoSmallLayout,
  threePanels: threePanelsLayout,
  twoPanels: twoPanelsLayout,
  threePanelAction: threePanelActionLayout
};

const defaultPageLayout = layouts.fullPage;

// Custom hook for responsive design
const useResponsive = (breakpoint: number = 768) => {
  const [isResponsive, setIsResponsive] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      setIsResponsive(window.innerWidth <= breakpoint);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, [breakpoint]);

  return isResponsive;
};

function App() {
  const [pages, setPages] = useState<ComicPageType[]>([
    { id: "1", panels: defaultPageLayout() },
  ]);
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [draggedImageUrl, setDraggedImageUrl] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<ResponsivePanel>('none');
  
  const isResponsive = useResponsive(768);

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
    const newPage: ComicPageType = {
      id: pageNumber.toString(),
      panels: layouts[templateName](),
    };
    setPages(prev => [...prev, newPage]);
    console.log('Added new page:', newPage.id);
    
    // Close panel after selection on mobile
    if (isResponsive) {
      setActivePanel('none');
    }
  };

  const handleRotatePage = (pageId: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            panels: rotatePanels(page.panels)
          };
        }
        return page;
      });
    });
  };

  const handleMirrorPage = (pageId: string) => {
    setPages(prevPages => {
      return prevPages.map(page => {
        if (page.id === pageId) {
          return {
            ...page,
            panels: mirrorPanels(page.panels)
          };
        }
        return page;
      });
    });
  };

  const handlePanelsUpdate = (pageId: string, updatedPanels: Panel[]) => {
    setPages(prevPages => prevPages.map(page => 
      page.id === pageId ? { ...page, panels: updatedPanels } : page
    ));
  };

  const togglePanel = (panel: ResponsivePanel) => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
  };

  return (
    <DragDropContext 
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <AppContainer $isResponsive={isResponsive}>
        <DesktopSidePanels $isResponsive={isResponsive}>
          <TemplateSelector onTemplateSelect={handleTemplateSelect} templates={layouts} />
        </DesktopSidePanels>
        
        <ComicContainer $isResponsive={isResponsive}>
          {pages.map((page, index) => (
            <ComicPage
              key={page.id}
              pageId={page.id}
              displayNumber={index + 1}
              panels={page.panels}
              onDelete={() => handleDeletePage(page.id)}
              onMoveUp={() => handleMovePageUp(index)}
              onMoveDown={() => handleMovePageDown(index)}
              onRotate={() => handleRotatePage(page.id)}
              onMirror={() => handleMirrorPage(page.id)}
              onPanelsUpdate={(panels) => handlePanelsUpdate(page.id, panels)}
              isFirstPage={index === 0}
              isLastPage={index === pages.length - 1}
              draggedImageUrl={draggedImageUrl}
            />
          ))}
        </ComicContainer>
        
        <DesktopSidePanels $isResponsive={isResponsive}>
          <ImageLibrary images={images} onImageUpload={handleImageUpload} />
        </DesktopSidePanels>

        <BottomPanel $isResponsive={isResponsive} $isVisible={activePanel !== 'none'}>
          <BottomControls>
            <ToggleButton 
              $isActive={activePanel === 'templates'}
              onClick={() => togglePanel('templates')}
            >
              Add Page
            </ToggleButton>
            <ToggleButton 
              $isActive={activePanel === 'images'}
              onClick={() => togglePanel('images')}
            >
              Add Image
            </ToggleButton>
          </BottomControls>
          
          <ResponsivePanelContainer $isVisible={activePanel !== 'none'}>
            {activePanel === 'templates' && (
              <HorizontalScrollContainer>
                <ResponsiveTemplateSelector>
                                     <TemplateSelector onTemplateSelect={handleTemplateSelect} templates={layouts} isHorizontal={true} />
                 </ResponsiveTemplateSelector>
               </HorizontalScrollContainer>
             )}
             
             {activePanel === 'images' && (
               <HorizontalScrollContainer>
                 <ResponsiveImageLibrary>
                   <ImageLibrary images={images} onImageUpload={handleImageUpload} isHorizontal={true} />
                </ResponsiveImageLibrary>
              </HorizontalScrollContainer>
            )}
          </ResponsivePanelContainer>
        </BottomPanel>
      </AppContainer>
    </DragDropContext>
  );
}

export default App;

