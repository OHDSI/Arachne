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

import React, { FC, memo, useDebugValue, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Zoom } from "./components";
import { PdfViewerContainer } from "./PdfViewer.styles";
import type { IPdfViewerProps } from "./PdfViewer.types";
import { SpinnerContainer } from "../MediaViewer/MediaViewer.styles";
import { Spinner } from "../Spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PdfViewer: FC<IPdfViewerProps> = memo(props => {
  const { data, height = 500, linkDownload, scaleDefault, scroll } = props;
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(scaleDefault ? scaleDefault : 1.0);
  // const [file, setFile] = useState('');

  const onDocumentLoadSuccess = document => {
    setNumPages(document.numPages);
  };

  // useEffect(() => {
  //   api.get(`documents/${data.id}/preview`).then((res: any) => setFile(res));
  // }, []);

  return (
    <PdfViewerContainer height={height} scroll={scroll}>
      <Document
        onLoadSuccess={onDocumentLoadSuccess}
        file={linkDownload ? linkDownload : `/api/documents/${data.id}/preview`}
        loading={
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        }
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={scale}
          />
        ))}
      </Document>
      <Zoom scale={scale} onChange={setScale} />
    </PdfViewerContainer>
  );
});
