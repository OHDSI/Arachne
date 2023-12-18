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

import React, { FC } from "react";
import { CsvViewer } from "../CsvViewer";
import { CodeEditor } from "../CodeEditor";
import { ImageViewer } from "../ImageViewer";
import { PdfViewer } from "../PdfViewer";
import { MediaViewerDefaultContent } from "./MediaViewer.styles";
import type { IMediaViewerProps } from "./MediaViewer.types";
import { MediaType } from "../../enums/MediaType";

export const MediaViewer: FC<IMediaViewerProps> = props => {
  const {
    data,
    height = 500,
    downloadMethod,
    remoteFile = true,
    pdfLink,
  } = props;

  if (!data.mediaType) {
    return null;
  }

  switch (data.mediaType) {
  case MediaType.CODE: {
    return (
      <CodeEditor
        data={data}
        height={height}
        containerStyles={{ padding: 0 }}
        enableDownload={false}
        enableCopy={true}
        remoteFile={remoteFile}
        downloadMethod={downloadMethod}
        language={data.codeLanguage}
      />
    );
  }
  case MediaType.CSV: {
    return (
      <CsvViewer
        data={data}
        height={height}
        downloadMethod={downloadMethod}
      />
    );
  }
  case MediaType.PDF: {
    return <PdfViewer data={data} height={height} linkDownload={pdfLink} />;
  }
  case MediaType.IMAGE: {
    return <ImageViewer data={data as any} height={height} />;
  }
  case MediaType.ARCHIVE:
  default: {
    return (
      <MediaViewerDefaultContent>
          Content of this file cannot be displayed
      </MediaViewerDefaultContent>
    );
  }
  }
};
