import React, { useState, useEffect } from 'react';
import { Point } from '../../types/comic';

interface PanelImageProps {
  src: string;
  panelId: string;
  width: number;
  height: number;
  position: { x: number, y: number };
  points: Point[]; // used to calculate the offset of the background image
}

const PanelImage: React.FC<PanelImageProps> = ({
  src,
  panelId,
  width,
  height,
  position,
  points
}) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
  }, [src]);

  const scale = Math.max(
    width / imageDimensions.width,
    height / imageDimensions.height
  );

  const scaledWidth = imageDimensions.width * scale;
  const scaledHeight = imageDimensions.height * scale;

  const baseX = (width - scaledWidth) / 2;
  const baseY = (height - scaledHeight) / 2;

  const panelOffsetX = Math.min(...points.map(p => p[0]));
  const panelOffsetY = Math.min(...points.map(p => p[1]));

  return (
    <defs>
      <pattern
        id={`pattern-${panelId}`}
        patternUnits="userSpaceOnUse"
        patternContentUnits="userSpaceOnUse"
        x={panelOffsetX}
        y={panelOffsetY}
        width={width}
        height={height}
      >
        <image
          href={src}
          x={baseX + position.x}
          y={baseY + position.y}
          width={scaledWidth}
          height={scaledHeight}
          preserveAspectRatio="xMidYMid slice"
          style={{ pointerEvents: 'none' }}
        />
      </pattern>
    </defs>
  );
};

export default PanelImage;
