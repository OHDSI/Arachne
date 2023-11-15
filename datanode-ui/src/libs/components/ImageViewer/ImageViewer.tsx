import React, { FC, useMemo, useRef, useState, useEffect } from 'react';
import Viewer from 'react-viewer';
import { ImageViewerContainer } from './ImageViewer.styles';
import type { IImageViewerProps } from './ImageViewer.types';

export const ImageViewer: FC<IImageViewerProps> = props => {
  const { data, height = 500 } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const imageSrc = useMemo(() => `data:image;base64,${data}`, [data]);

  useEffect(() => {
    containerRef.current && setIsVisible(true);
  }, [containerRef.current]);

  return (
    <ImageViewerContainer ref={containerRef}>
      {isVisible && (
        <Viewer
          attribute={false}
          visible
          container={containerRef.current}
          images={[{ src: imageSrc }]}
          noNavbar
          noClose
          customToolbar={config =>
            config.filter(c => ![3, 4, 7, 11].includes(c.actionType))
          }
        />
      )}
    </ImageViewerContainer>
  );
};
