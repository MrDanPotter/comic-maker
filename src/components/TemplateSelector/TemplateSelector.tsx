import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';

const SelectorContainer = styled.div<{ $isHorizontal?: boolean }>`
  width: ${props => props.$isHorizontal ? 'auto' : '300px'};
  height: ${props => props.$isHorizontal ? '100%' : '100vh'};
  background: #f0f0f0;
  padding: 20px;
  position: ${props => props.$isHorizontal ? 'relative' : 'fixed'};
  left: ${props => props.$isHorizontal ? 'auto' : '0'};
  top: ${props => props.$isHorizontal ? 'auto' : '0'};
  overflow-y: ${props => props.$isHorizontal ? 'hidden' : 'auto'};
  overflow-x: ${props => props.$isHorizontal ? 'auto' : 'hidden'};
  border-right: ${props => props.$isHorizontal ? 'none' : '1px solid #ddd'};
  display: ${props => props.$isHorizontal ? 'flex' : 'block'};
  gap: ${props => props.$isHorizontal ? '15px' : '0'};
  align-items: ${props => props.$isHorizontal ? 'flex-start' : 'stretch'};
`;

const Title = styled.h2<{ $isHorizontal?: boolean }>`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5em;
  display: ${props => props.$isHorizontal ? 'none' : 'block'};
`;

const TemplatePreview = styled.div<{ $isHorizontal?: boolean }>`
  width: ${props => props.$isHorizontal ? '180px' : '100%'};
  height: ${props => props.$isHorizontal ? '200px' : 'auto'};
  padding-bottom: ${props => props.$isHorizontal ? '0' : '125%'};
  background: white;
  margin-bottom: ${props => props.$isHorizontal ? '0' : '20px'};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const PreviewContainer = styled.div<{ $isHorizontal?: boolean }>`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: ${props => props.$isHorizontal ? '35px' : '10px'};
  background: white;
  padding: 10px;
`;

const PreviewSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const PreviewPanel = styled.path`
  fill: #e0e0e0;
  stroke: #999;
  stroke-width: 1px;
`;

const TemplateName = styled.div<{ $isHorizontal?: boolean }>`
  position: absolute;
  bottom: ${props => props.$isHorizontal ? '5px' : '-5px'};
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 500;
  color: #666;
  margin-bottom: ${props => props.$isHorizontal ? '0' : '10px'};
  font-size: ${props => props.$isHorizontal ? '12px' : '14px'};
`;

type LayoutType = 
  | "fullPage"
  | "widePage" 
  | "sixPanels"
  | "fourPanels"
  | "oneBigTwoSmall"
  | "threePanels"
  | "twoPanels"
  | "threePanelAction";

interface TemplateSelectorProps {
  onTemplateSelect: (templateName: LayoutType) => void;
  templates: Record<LayoutType, () => Panel[]>;
  isHorizontal?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, templates, isHorizontal = false }) => {
  // Scale points to fit preview container
  const scalePoints = (points: [number, number][]): [number, number][] => {
    // Assuming the original points are in a 800x1000 coordinate space
    // Scale them down to fit in our 100x125 viewBox
    const scaleX = 100 / 800;
    const scaleY = 125 / 1000;
    return points.map(([x, y]) => [x * scaleX, y * scaleY]);
  };

  const getDisplayName = (templateName: LayoutType): string => {
    switch (templateName) {
      case 'fullPage':
        return 'Full Page';
      case 'widePage':
        return 'Wide Page';
      case 'sixPanels':
        return '6 Panels';
      case 'fourPanels':
        return '4 Panels';
      case 'oneBigTwoSmall':
        return '1 Big 2 Small';
      case 'threePanels':
        return '3 Panels';
      case 'twoPanels':
        return '2 Panels';
      case 'threePanelAction':
        return '3 Panel Action';
      default:
        return templateName;
    }
  };

  return (
    <SelectorContainer $isHorizontal={isHorizontal}>
      <Title $isHorizontal={isHorizontal}>Add a Page</Title>
      {(Object.keys(templates) as LayoutType[]).map(templateName => {
        const sampleLayout = templates[templateName]();
        
        return (
          <TemplatePreview 
            key={templateName} 
            onClick={() => onTemplateSelect(templateName)}
            $isHorizontal={isHorizontal}
          >
            <PreviewContainer $isHorizontal={isHorizontal}>
              <PreviewSvg viewBox="0 0 100 125">
                {sampleLayout.map(panel => (
                  <PreviewPanel
                    key={panel.id}
                    d={pointsToSvgPath(scalePoints(panel.points))}
                  />
                ))}
              </PreviewSvg>
            </PreviewContainer>
            <TemplateName $isHorizontal={isHorizontal}>{getDisplayName(templateName)}</TemplateName>
          </TemplatePreview>
        );
      })}
    </SelectorContainer>
  );
};

export default TemplateSelector; 