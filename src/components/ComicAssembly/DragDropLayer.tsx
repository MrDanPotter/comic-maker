import React, { useState } from 'react';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectAiEnabled, selectApiKey } from '../../store/slices/appStateSlice';
import { addImage } from '../../store/slices/imageLibrarySlice';
import { Panel, BoundingBox } from '../../types/comic';
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

  const handleImageGenerated = (imageUrl: string) => {
    if (selectedPanelId) {
      onPanelImageUpdate(selectedPanelId, imageUrl);
      
      // Add AI-generated image to the library
      const newImage = {
        id: `ai-image-${Date.now()}`,
        url: imageUrl,
        isUsed: true,
        usedInPanels: [selectedPanelId],
        source: 'ai' as const,
        isDownloaded: false
      };
      dispatch(addImage(newImage));
    }
  };

  const getPanelAspectRatio = (panel: Panel): string => {
    const bounds = {
      left: Math.min(...panel.points.map(p => p[0])),
      right: Math.max(...panel.points.map(p => p[0])),
      top: Math.min(...panel.points.map(p => p[1])),
      bottom: Math.max(...panel.points.map(p => p[1]))
    };
    
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    
    // Simplify the ratio
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(Math.round(width), Math.round(height));
    const ratioWidth = Math.round(width / divisor);
    const ratioHeight = Math.round(height / divisor);
    
    return `${ratioWidth}:${ratioHeight}`;
  };

  const selectedPanel = selectedPanelId ? panels.find(p => p.id === selectedPanelId) : null;
  const aspectRatio = selectedPanel ? getPanelAspectRatio(selectedPanel) : '1:1';

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
        />
      )}
    </>
  );
};

export default DragDropLayer; 