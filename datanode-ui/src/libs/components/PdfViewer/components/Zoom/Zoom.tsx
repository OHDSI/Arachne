/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React, { FC, MouseEvent } from "react";
import { IZoomProps } from "./Zoom.types";
import { ZoomContainer, ZoomContent, IconContainer } from "./Zoom.styles";
import { IconOld } from "../../../Icon/Icon.old";

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
