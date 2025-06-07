import React, { useState, useEffect } from 'react';

interface PanelImageProps {
  src: string;
  alt: string;
  panelId: string;
  width: number;
  height: number;
}

const PanelImage: React.FC<PanelImageProps> = ({ src, alt, panelId, width, height }) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const patternId = `pattern-${panelId}`;

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = src;
  }, [src]);

  // Calculate scale to cover the panel
  const scale = Math.max(
    width / imageDimensions.width,
    height / imageDimensions.height
  );

  const scaledWidth = imageDimensions.width * scale;
  const scaledHeight = imageDimensions.height * scale;

  // Center the image in the pattern
  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;

  return (
    <defs>
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={width}
        height={height}
      >
        <image
          href={src}
          x={x}
          y={y}
          width={scaledWidth}
          height={scaledHeight}
          preserveAspectRatio="xMidYMid slice"
        />
      </pattern>
    </defs>
  );
};

export default PanelImage; 