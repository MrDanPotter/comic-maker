import React from 'react';
import styled from 'styled-components';

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
  position: relative; /* For absolute positioning of PreviewContainer */

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
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  padding: 10px;
  align-content: flex-start;
`;

const PreviewPanel = styled.div<{ width: string; height: string }>`
  background: #e0e0e0;
  width: calc(${props => props.width} - 2px);
  height: calc(${props => {
    // Convert percentage string to number
    const heightPercent = parseFloat(props.height);
    // Scale the height relative to width to maintain aspect ratio
    return `${heightPercent * 0.8}%`;
  }});
  border: 1px solid #999;
  min-height: 20px;
  margin-bottom: 2%;
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

interface TemplateSelectorProps {
  onTemplateSelect: (templateName: "quadrant" | "threePanel" | "mangaStyle" | "sixPanel") => void;
  templates: Record<string, Array<{ id: string; width: string; height: string }>>;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, templates }) => {
  return (
    <SelectorContainer>
      <Title>Add a Page</Title>
      {Object.entries(templates).map(([templateName, layout]) => (
        <TemplatePreview key={templateName} onClick={() => onTemplateSelect(templateName as "quadrant" | "threePanel" | "mangaStyle" | "sixPanel")}>
          <PreviewContainer>
            {layout.map(panel => {
              // Adjust panel dimensions for preview
              const width = panel.width;
              const height = panel.height;
              
              return (
                <PreviewPanel
                  key={panel.id}
                  width={width}
                  height={height}
                />
              );
            })}
          </PreviewContainer>
          <TemplateName>
            {templateName.charAt(0).toUpperCase() + templateName.slice(1)} Layout
          </TemplateName>
        </TemplatePreview>
      ))}
    </SelectorContainer>
  );
};

export default TemplateSelector; 