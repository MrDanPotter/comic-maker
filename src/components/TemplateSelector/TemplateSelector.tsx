import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';

const SelectorContainer = styled.div`
  width: 300px;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  border-right: 1px solid #ddd;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5em;
`;

const TemplatePreview = styled.div`
  width: 100%;
  padding-bottom: 125%; /* Creates a 4:5 aspect ratio container */
  background: white;
  margin-bottom: 20px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const PreviewContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
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

const TemplateName = styled.div`
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 500;
  color: #666;
  margin-bottom: 10px;
`;

type LayoutType = 
  | "fullPage"
  | "widePage" 
  | "sixPanels"
  | "fourPanels"
  | "oneBigTwoSmall"
  | "threePanels"
  | "twoPanels";

interface TemplateSelectorProps {
  onTemplateSelect: (templateName: LayoutType) => void;
  templates: Record<LayoutType, () => Panel[]>;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, templates }) => {
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
      default:
        return templateName;
    }
  };

  return (
    <SelectorContainer>
      <Title>Add a Page</Title>
      {(Object.keys(templates) as LayoutType[]).map(templateName => {
        const sampleLayout = templates[templateName]();
        
        return (
          <TemplatePreview 
            key={templateName} 
            onClick={() => onTemplateSelect(templateName)}
          >
            <PreviewContainer>
              <PreviewSvg viewBox="0 0 100 125">
                {sampleLayout.map(panel => (
                  <PreviewPanel
                    key={panel.id}
                    d={pointsToSvgPath(scalePoints(panel.points))}
                  />
                ))}
              </PreviewSvg>
            </PreviewContainer>
            <TemplateName>{getDisplayName(templateName)}</TemplateName>
          </TemplatePreview>
        );
      })}
    </SelectorContainer>
  );
};

export default TemplateSelector; 