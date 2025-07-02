import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectAiEnabled, selectApiKey } from '../../store/slices/appStateSlice';
import { addImage, selectAllImages } from '../../store/slices/imageLibrarySlice';
import { ReferenceImage } from '../../services/imageGeneratorService';
import { Panel, AspectRatio } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import { isRectangular } from '../../utils/mathUtils';
import PanelImage from './PanelImage';
import ResizeIndicator from './ResizeIndicator';
import AiSparkleButton from './AiSparkleButton';
import AiImageModal from '../AiImageModal';

/**
 * SvgPanel Component
 * 
 * Renders comic panels as SVG elements with the following features:
 * - SVG-based panel rendering with support for non-rectangular shapes
 * - Panel images with drag-and-drop positioning within panels
 * - Resize indicators for adjacent panels
 * - AI sparkle buttons (SVG elements) for image generation
 * - Mouse event handling for panel hover detection
 * 
 * All inner components are SVG elements:
 * - PanelImage: SVG image elements with clipping masks
 * - EmptyPanelPolygon: SVG path elements for empty panels
 * - ResizeIndicator: SVG line elements for resize handles
 * - SvgAiSparkleButton: SVG group elements for AI buttons
 */
interface SvgPanelProps {
  panels: Panel[];
  pageId: string;
  onPanelsUpdate: (panels: Panel[]) => void;
  onPanelImageUpdate: (panelId: string, imageUrl: string) => void;
}

const PanelContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const EmptyPanelPolygon = styled.path<{ $isResizing: boolean }>`
  stroke: #333;
  stroke-width: 2px;
  fill: #f5f5f5;
  transition: ${props => props.$isResizing ? 'none' : 'd 0.5s ease-in-out'};
`;

const AnimatedGroup = styled.g<{ $isResizing: boolean }>`
  transition: ${props => props.$isResizing ? 'none' : 'd 0.5s ease-in-out'};
`;

interface ResizeGap {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isVertical: boolean;
  panels: {
    panel: Panel;
    edge: 'top' | 'bottom' | 'left' | 'right';
  }[];
}

interface PanelBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const SvgPanel: React.FC<SvgPanelProps> = ({ panels, pageId, onPanelsUpdate, onPanelImageUpdate }) => {
  const aiEnabled = useAppSelector(selectAiEnabled);
  const apiKey = useAppSelector(selectApiKey);
  const allImages = useAppSelector(selectAllImages);
  const dispatch = useAppDispatch();
  const [isResizing, setIsResizing] = useState(false);
  const [localPanels, setLocalPanels] = useState(panels);
  const [hoveredPanelId, setHoveredPanelId] = useState<string | null>(null);

  // Log hovered panel changes
  React.useEffect(() => {
    console.log(`🔄 Hovered panel changed to: ${hoveredPanelId}`);
  }, [hoveredPanelId]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);

  // Update local panels when prop changes
  React.useEffect(() => {
    console.log(`📋 Updating local panels:`, panels.map(p => ({ id: p.id, hasImage: !!p.imageUrl })));
    setLocalPanels(panels);
  }, [panels]);

  const getPanelBounds = useCallback((panel: Panel): PanelBounds => ({
    left: Math.min(...panel.points.map(p => p[0])),
    right: Math.max(...panel.points.map(p => p[0])),
    top: Math.min(...panel.points.map(p => p[1])),
    bottom: Math.max(...panel.points.map(p => p[1]))
  }), []);

  const resizeGaps = useMemo(() => {
    const gaps: ResizeGap[] = [];
    const GAP_THRESHOLD = 20; // Maximum gap width to consider for resizing

    // Find vertical gaps (panels side by side)
    localPanels.forEach((panel1, i) => {
      // Skip if the current panel is not rectangular
      if (!isRectangular(panel1.points)) return;

      const bounds1 = getPanelBounds(panel1);
      
      // Find all panels that share a vertical border with panel1
      const rightNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough horizontally
        const isHorizontallyAdjacent = Math.abs(bounds1.right - bounds2.left) < GAP_THRESHOLD;
        // Check if panels overlap vertically
        const verticalOverlap = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);
        return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
      });

      const leftNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough horizontally
        const isHorizontallyAdjacent = Math.abs(bounds1.left - bounds2.right) < GAP_THRESHOLD;
        // Check if panels overlap vertically
        const verticalOverlap = Math.min(bounds1.bottom, bounds2.bottom) - Math.max(bounds1.top, bounds2.top);
        return isHorizontallyAdjacent && verticalOverlap > 0 && isRectangular(panel2.points);
      });

      // Process right neighbors
      if (rightNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapTop = Math.max(
          bounds1.top,
          ...rightNeighbors.map(p => getPanelBounds(p).top)
        );
        const overlapBottom = Math.min(
          bounds1.bottom,
          ...rightNeighbors.map(p => getPanelBounds(p).bottom)
        );

        const x = (bounds1.right + Math.min(...rightNeighbors.map(p => getPanelBounds(p).left))) / 2;

        gaps.push({
          x1: x,
          y1: overlapTop,
          x2: x,
          y2: overlapBottom,
          isVertical: true,
          panels: [
            { panel: panel1, edge: 'right' },
            ...rightNeighbors.map(p => ({ panel: p, edge: 'left' as const }))
          ]
        });
      }

      // Process left neighbors
      if (leftNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapTop = Math.max(
          bounds1.top,
          ...leftNeighbors.map(p => getPanelBounds(p).top)
        );
        const overlapBottom = Math.min(
          bounds1.bottom,
          ...leftNeighbors.map(p => getPanelBounds(p).bottom)
        );

        const x = (bounds1.left + Math.max(...leftNeighbors.map(p => getPanelBounds(p).right))) / 2;

        gaps.push({
          x1: x,
          y1: overlapTop,
          x2: x,
          y2: overlapBottom,
          isVertical: true,
          panels: [
            { panel: panel1, edge: 'left' },
            ...leftNeighbors.map(p => ({ panel: p, edge: 'right' as const }))
          ]
        });
      }

      // Find horizontal gaps (panels stacked)
      const bottomNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough vertically
        const isVerticallyAdjacent = Math.abs(bounds1.bottom - bounds2.top) < GAP_THRESHOLD;
        // Check if panels overlap horizontally
        const horizontalOverlap = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
        return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
      });

      const topNeighbors = localPanels.slice(i + 1).filter(panel2 => {
        const bounds2 = getPanelBounds(panel2);
        // Check if panels are close enough vertically
        const isVerticallyAdjacent = Math.abs(bounds1.top - bounds2.bottom) < GAP_THRESHOLD;
        // Check if panels overlap horizontally
        const horizontalOverlap = Math.min(bounds1.right, bounds2.right) - Math.max(bounds1.left, bounds2.left);
        return isVerticallyAdjacent && horizontalOverlap > 0 && isRectangular(panel2.points);
      });

      // Process bottom neighbors
      if (bottomNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapLeft = Math.max(
          bounds1.left,
          ...bottomNeighbors.map(p => getPanelBounds(p).left)
        );
        const overlapRight = Math.min(
          bounds1.right,
          ...bottomNeighbors.map(p => getPanelBounds(p).right)
        );

        const y = (bounds1.bottom + Math.min(...bottomNeighbors.map(p => getPanelBounds(p).top))) / 2;

        gaps.push({
          x1: overlapLeft,
          y1: y,
          x2: overlapRight,
          y2: y,
          isVertical: false,
          panels: [
            { panel: panel1, edge: 'bottom' },
            ...bottomNeighbors.map(p => ({ panel: p, edge: 'top' as const }))
          ]
        });
      }

      // Process top neighbors
      if (topNeighbors.length > 0) {
        // Find the overlapping region for all panels
        const overlapLeft = Math.max(
          bounds1.left,
          ...topNeighbors.map(p => getPanelBounds(p).left)
        );
        const overlapRight = Math.min(
          bounds1.right,
          ...topNeighbors.map(p => getPanelBounds(p).right)
        );

        const y = (bounds1.top + Math.max(...topNeighbors.map(p => getPanelBounds(p).bottom))) / 2;

        gaps.push({
          x1: overlapLeft,
          y1: y,
          x2: overlapRight,
          y2: y,
          isVertical: false,
          panels: [
            { panel: panel1, edge: 'top' },
            ...topNeighbors.map(p => ({ panel: p, edge: 'bottom' as const }))
          ]
        });
      }
    });

    return gaps;
  }, [localPanels, getPanelBounds]);

  const handleResize = useCallback((updatedPanels: Panel[]) => {
    // Create a map of panel IDs to their updated versions
    const updatedPanelMap = new Map(updatedPanels.map(p => [p.id, p]));
    
    // Update all panels, using the updated version if available
    const newPanels = localPanels.map(panel => 
      updatedPanelMap.get(panel.id) || panel
    );

    // Update local state immediately for smooth resize indicator updates
    setLocalPanels(newPanels);
    // Propagate changes to parent
    onPanelsUpdate(newPanels);
  }, [localPanels, onPanelsUpdate]);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // AI-related handlers
const handlePanelMouseEnter = (panelId: string) => {
    console.log(`🐭 Mouse ENTER panel: ${panelId}`);
    if (aiEnabled && apiKey) {
      console.log(`✨ Setting hovered panel to: ${panelId}`);
      setHoveredPanelId(panelId);
    } else {
      console.log(`❌ AI not enabled or no API key`);
    }
  };

  // Track mouse position globally
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update mouse position on mouse move
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Log mouse position changes (throttled to avoid spam)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log(`📍 Mouse position updated: (${mousePosition.x}, ${mousePosition.y})`);
    }, 100); // Only log every 100ms to avoid console spam
    
    return () => clearTimeout(timeoutId);
  }, [mousePosition]);

  const createMouseLeaveHandler = (panelId: string) => () => {
    console.log(`🐭 Mouse LEAVE panel: ${panelId}`);
    console.log(`📍 Current mouse position: (${mousePosition.x}, ${mousePosition.y})`);
    
    const panel = localPanels.find(p => p.id === panelId);
    if (!panel) {
      console.log(`❌ Panel not found: ${panelId}`);
      return;
    }
    
    const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };
    console.log(`📦 Panel dropZone:`, dropZone);
    
    // Get the SVG container's position
    const svgContainer = document.querySelector('.comic-page-svg');
    if (!svgContainer) {
      console.log(`❌ SVG container not found`);
      return;
    }
    
    const rect = svgContainer.getBoundingClientRect();
    console.log(`📐 SVG container rect:`, rect);
    
    const relativeX = mousePosition.x - rect.left;
    const relativeY = mousePosition.y - rect.top;
    console.log(`📍 Relative mouse position: (${relativeX}, ${relativeY})`);
    
    // Check if mouse is still within the panel bounds
    const isWithinPanel = 
      relativeX >= dropZone.left && 
      relativeX <= dropZone.left + dropZone.width &&
      relativeY >= dropZone.top && 
      relativeY <= dropZone.top + dropZone.height;
    
    console.log(`🔍 Mouse within panel bounds: ${isWithinPanel}`);
    console.log(`   X check: ${relativeX} >= ${dropZone.left} && ${relativeX} <= ${dropZone.left + dropZone.width}`);
    console.log(`   Y check: ${relativeY} >= ${dropZone.top} && ${relativeY} <= ${dropZone.top + dropZone.height}`);
    
    // Only hide if mouse is truly outside the panel
    if (!isWithinPanel) {
      console.log(`👋 Hiding AI button for panel: ${panelId}`);
      setHoveredPanelId(null);
    } else {
      console.log(`✅ Keeping AI button visible for panel: ${panelId}`);
    }
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
    const selectedPanel = localPanels.find(p => p.id === panelId);
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

  const selectedPanel = selectedPanelId ? localPanels.find(p => p.id === selectedPanelId) : null;
  const aspectRatio = selectedPanel ? getPanelAspectRatio(selectedPanel) : ('square' as AspectRatio);
  const existingImageInfo = selectedPanelId ? getExistingImageInfo(selectedPanelId) : { imageUrl: undefined, prompt: undefined, referenceImages: undefined };

    return (
    <>
      <PanelContainer className="comic-page-svg">
        {localPanels.map(panel => {
          const svgPath = pointsToSvgPath(panel.points);
          const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

          return (
            <AnimatedGroup key={panel.id} $isResizing={isResizing}>
              {panel.imageUrl ? (
                <PanelImage
                  src={panel.imageUrl}
                  panelId={panel.id}
                  pageId={pageId}
                  width={dropZone.width}
                  height={dropZone.height}
                  points={panel.points}
                  dropZone={dropZone}
                  isResizing={isResizing}
                  onMouseEnter={() => handlePanelMouseEnter(panel.id)}
                  onMouseLeave={createMouseLeaveHandler(panel.id)}
                />
              ) : (
                <EmptyPanelPolygon 
                  d={svgPath} 
                  $isResizing={isResizing}
                  onMouseEnter={() => handlePanelMouseEnter(panel.id)}
                  onMouseLeave={createMouseLeaveHandler(panel.id)}
                />
              )}
            </AnimatedGroup>
          );
        })}
        {resizeGaps.map((gap, index) => (
          <ResizeIndicator
            key={`gap-${index}`}
            x1={gap.x1}
            y1={gap.y1}
            x2={gap.x2}
            y2={gap.y2}
            isVertical={gap.isVertical}
            panels={gap.panels}
            onResize={handleResize}
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
          />
        ))}
        
        {/* AI Sparkle Buttons - SVG elements inside the SVG container */}
        {aiEnabled && apiKey && localPanels.map(panel => {
          const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };
          const isVisible = hoveredPanelId === panel.id;
          console.log(`🎨 Rendering AI button for panel ${panel.id}: visible=${isVisible}`);
          return (
            <AiSparkleButton
              key={`ai-button-${panel.id}`}
              onClick={() => handleSparkleClick(panel.id)}
              isVisible={isVisible}
              x={dropZone.left + dropZone.width - 48}
              y={dropZone.top + 8}
            />
          );
        })}
      </PanelContainer>
      
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

export default SvgPanel;
