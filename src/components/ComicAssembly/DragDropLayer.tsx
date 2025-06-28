import React, { useState } from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectAiEnabled, selectApiKey } from '../../store/slices/appStateSlice';
import { addImage, selectAllImages } from '../../store/slices/imageLibrarySlice';
import { ReferenceImage } from '../../services/imageGeneratorService';
import { Panel, BoundingBox, AspectRatio } from '../../types/comic';
import AiSparkleButton from './AiSparkleButton';
import AiImageModal from '../AiImageModal';

interface DragDropLayerProps {
  panels: Panel[];
  pageId: string;
  draggedImageUrl: string | null;
  onPanelImageUpdate: (panelId: string, imageUrl: string) => void;
}

const LayerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const DroppableOverlay = styled.div<{ $dropZone: BoundingBox }>`
  position: absolute;
  top: ${props => props.$dropZone.top}px;
  left: ${props => props.$dropZone.left}px;
  width: ${props => props.$dropZone.width}px;
  height: ${props => props.$dropZone.height}px;
  pointer-events: none;

  &.dragging-over {
    pointer-events: all;
  }
`;

const PreviewImage = styled.img<{ $isDraggingOver: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$isDraggingOver ? 0.4 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
`;

const PreviewBorder = styled.div<{ $isDraggingOver: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #666;
  opacity: ${props => props.$isDraggingOver ? 1 : 0};
  pointer-events: none;
`;

const DragDropLayer: React.FC<DragDropLayerProps> = ({ 
  panels, 
  pageId, 
  draggedImageUrl, 
  onPanelImageUpdate 
}) => {
  const aiEnabled = useAppSelector(selectAiEnabled);
  const apiKey = useAppSelector(selectApiKey);
  const allImages = useAppSelector(selectAllImages);
  const dispatch = useAppDispatch();
  const [hoveredPanelId, setHoveredPanelId] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);

  const handlePanelMouseEnter = (panelId: string) => {
    if (aiEnabled && apiKey) {
      setHoveredPanelId(panelId);
    }
  };

  const handlePanelMouseLeave = () => {
    setHoveredPanelId(null);
  };

  const handleSparkleClick = (panelId: string) => {
    setSelectedPanelId(panelId);
    setShowAiModal(true);
  };

  const handleCloseModal = () => {
    setShowAiModal(false);
    setSelectedPanelId(null);
  };

  const handleImageGenerated = (imageUrl: string, prompt?: string, referenceImages?: ReferenceImage[]) => {
    if (selectedPanelId) {
      onPanelImageUpdate(selectedPanelId, imageUrl);
      
      // Add AI-generated image to the library
      const newImage = {
        id: `ai-image-${Date.now()}`,
        url: imageUrl,
        isUsed: true,
        usedInPanels: [selectedPanelId],
        source: 'ai' as const,
        isDownloaded: false,
        prompt: prompt,
        referenceImages: referenceImages
      };
      dispatch(addImage(newImage));
    }
  };

  // Get existing image information for the selected panel
  const getExistingImageInfo = (panelId: string) => {
    const selectedPanel = panels.find(p => p.id === panelId);
    if (!selectedPanel?.imageUrl) return { imageUrl: undefined, prompt: undefined, referenceImages: undefined };
    
    // Find the image in the library to get the prompt and reference images
    const imageInLibrary = allImages.find(img => img.url === selectedPanel.imageUrl);
    return {
      imageUrl: selectedPanel.imageUrl,
      prompt: imageInLibrary?.prompt,
      referenceImages: imageInLibrary?.referenceImages
    };
  };

  const getPanelAspectRatio = (panel: Panel): AspectRatio => {
    const bounds = {
      left: Math.min(...panel.points.map(p => p[0])),
      right: Math.max(...panel.points.map(p => p[0])),
      top: Math.min(...panel.points.map(p => p[1])),
      bottom: Math.max(...panel.points.map(p => p[1]))
    };
    
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    
    // Determine aspect ratio based on width vs height
    if (Math.abs(width - height) < 200) {
      return 'square';
    } else if (width > height) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  };

  const selectedPanel = selectedPanelId ? panels.find(p => p.id === selectedPanelId) : null;
  const aspectRatio = selectedPanel ? getPanelAspectRatio(selectedPanel) : ('square' as AspectRatio);
  const existingImageInfo = selectedPanelId ? getExistingImageInfo(selectedPanelId) : { imageUrl: undefined, prompt: undefined, referenceImages: undefined };

  return (
    <>
      <LayerContainer>
        {panels.map(panel => {
          const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

          return (
            <Droppable key={panel.id} droppableId={`${pageId}-${panel.id}`} type="IMAGE_LIBRARY">
              {(provided, snapshot) => (
                <DroppableOverlay
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={snapshot.isDraggingOver ? 'dragging-over' : ''}
                  $dropZone={dropZone}
                  onMouseEnter={() => handlePanelMouseEnter(panel.id)}
                  onMouseLeave={handlePanelMouseLeave}
                  style={{ pointerEvents: aiEnabled && apiKey ? 'auto' : 'none' }}
                >
                  {draggedImageUrl && (
                    <>
                      <PreviewImage
                        src={draggedImageUrl}
                        $isDraggingOver={snapshot.isDraggingOver}
                        alt="Preview"
                      />
                      <PreviewBorder $isDraggingOver={snapshot.isDraggingOver} />
                    </>
                  )}
                  
                  {/* AI Sparkle Button */}
                  {aiEnabled && apiKey && (
                    <AiSparkleButton
                      onClick={() => handleSparkleClick(panel.id)}
                      isVisible={hoveredPanelId === panel.id}
                    />
                  )}
                  
                  {provided.placeholder}
                </DroppableOverlay>
              )}
            </Droppable>
          );
        })}
      </LayerContainer>
      
      {/* AI Image Generation Modal */}
      {showAiModal && apiKey && (
        <AiImageModal
          isOpen={showAiModal}
          onClose={handleCloseModal}
          onImageGenerated={handleImageGenerated}
          aspectRatio={aspectRatio}
          apiKey={apiKey}
          imageUrl={existingImageInfo.imageUrl}
          existingPrompt={existingImageInfo.prompt}
          existingReferenceImages={existingImageInfo.referenceImages}
        />
      )}
    </>
  );
};

export default DragDropLayer; 