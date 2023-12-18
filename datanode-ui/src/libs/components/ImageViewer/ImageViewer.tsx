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

import React, { FC, useMemo, useRef, useState, useEffect } from "react";
import Viewer from "react-viewer";
import { ImageViewerContainer } from "./ImageViewer.styles";
import type { IImageViewerProps } from "./ImageViewer.types";

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
