import React, { FC, MouseEvent } from 'react';
import { IZoomProps } from './Zoom.types';
import { ZoomContainer, ZoomContent, IconContainer } from './Zoom.styles';
import { IconOld } from '../../../Icon/Icon.old';

export const Zoom: FC<IZoomProps> = props => {
  const scaleStep = 0.1;
  const { scale, onChange } = props;

  const handleZoomIn = (e: MouseEvent) => {
    e.preventDefault();
    const newScale = scale + scaleStep;
    onChange(newScale);
  };
  const handleZoomOut = (e: MouseEvent) => {
    const newScale = scale - scaleStep;
    if (newScale > scaleStep) {
      onChange(newScale);
    }
  };

  return (
    <ZoomContainer>
      <IconContainer onClick={handleZoomIn}>
        <IconOld iconName="zoomIn" />
      </IconContainer>
      <ZoomContent>{parseInt(String(scale * 100), 10)}%</ZoomContent>
      <IconContainer onClick={handleZoomOut}>
        <IconOld iconName="zoomOut" />
      </IconContainer>
    </ZoomContainer>
  );
};
