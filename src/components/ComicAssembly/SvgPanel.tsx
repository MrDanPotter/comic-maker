import React from 'react';
import styled from 'styled-components';
import { Panel } from '../../types/comic';
import { pointsToSvgPath } from '../../utils/polygonUtils';
import PanelImage from './PanelImage';

interface SvgPanelProps {
  panels: Panel[];
  pageId: string;
}

const PanelContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const EmptyPanelPolygon = styled.path`
  stroke: #333;
  stroke-width: 2px;
  fill: #f5f5f5;
  transition: d 0.5s ease-in-out;
`;

const AnimatedGroup = styled.g`
  transition: transform 0.5s ease-in-out;
`;

const SvgPanel: React.FC<SvgPanelProps> = ({ panels, pageId }) => {
  return (
    <PanelContainer>
      {panels.map(panel => {
        const svgPath = pointsToSvgPath(panel.points);
        const dropZone = panel.dropZone || { top: 0, left: 0, width: 0, height: 0 };

        return (
          <AnimatedGroup key={panel.id}>
            {panel.imageUrl ? (
              <PanelImage
                src={panel.imageUrl}
                panelId={panel.id}
                pageId={pageId}
                width={dropZone.width}
                height={dropZone.height}
                points={panel.points}
                dropZone={dropZone}
              />
            ) : (
              <EmptyPanelPolygon d={svgPath} />
            )}
          </AnimatedGroup>
        );
      })}
    </PanelContainer>
  );
};

export default SvgPanel;
