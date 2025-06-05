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
  height: 200px;
  background: white;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const PreviewPanel = styled.div<{ width: string; height: string }>`
  background: #e0e0e0;
  width: ${props => props.width};
  height: ${props => props.height};
  border: 1px solid #999;
`;

const TemplateName = styled.div`
  margin-top: 8px;
  text-align: center;
  font-weight: 500;
  color: #666;
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
            {layout.map(panel => (
              <PreviewPanel
                key={panel.id}
                width={panel.width}
                height={panel.height}
              />
            ))}
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