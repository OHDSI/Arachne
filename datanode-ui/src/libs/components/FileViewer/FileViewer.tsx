import React, { useEffect, useState } from 'react';

import { CodeEditor } from '../CodeEditor';
import { CsvViewer } from '../CsvViewer';
import { PdfViewer } from '../PdfViewer';
import { FileViewerContainer, NoDataContainer } from './FileViewer.styles';

import { FileExtension } from '../../enums/FileExtension';
import { getCodeLanguageByFileExtension } from '../../utils/getCodeLanguageByFileExtension';
import { ErrorBoundary } from '../ErrorBoundary';

enum ViewerTypes {
  CSV = 'CSV',
  CODE = 'CODE',
  ARCHVE = 'ARCHIVE',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
}

const getViewerType = ext => {
  switch (ext) {
    case FileExtension.CSV:
      return ViewerTypes.CSV;
    case FileExtension.PDF:
      return ViewerTypes.PDF;
    case FileExtension.HTML:
    case FileExtension.JSON:
    case FileExtension.JS:
    case FileExtension.SQL:
    case FileExtension.R:
    case FileExtension.RPROFILE:
    case FileExtension.TXT:
      return ViewerTypes.CODE;
    case FileExtension.ZIP:
    case FileExtension.JAR:
      return ViewerTypes.ARCHVE;
    default: {
      return ViewerTypes.CODE;
    }
  }
};

export const Fileviewer: React.FC<any> = props => {
  const { fileContent, fileMetadata, status, pdfLink, height } = props;
  const [viewerType, setViewerType] = useState<ViewerTypes>();

  useEffect(() => {
    if (fileMetadata?.ext) {
      setViewerType(getViewerType(fileMetadata.ext));
    }
  }, [fileMetadata]);

  if (status === 'LOADING_FILE') {
    return <NoDataContainer>Loading...</NoDataContainer>;
  }

  return (
    <FileViewerContainer>
      <ErrorBoundary
        fallback={
          <NoDataContainer>
            Content of this file cannot be displayed
          </NoDataContainer>
        }
      >
        <>
          {(!fileContent || !viewerType) && (
            <NoDataContainer>Select file to display content</NoDataContainer>
          )}

          {fileContent && viewerType && (
            <>
              {viewerType === ViewerTypes.CODE && (
                <CodeEditor
                  data={fileContent}
                  height={height || '80vh'}
                  containerStyles={{ padding: 0 }}
                  enableDownload={false}
                  enableCopy={true}
                  language={getCodeLanguageByFileExtension(fileMetadata.ext)}
                />
              )}
              {viewerType === ViewerTypes.CSV && (
                <CsvViewer data={fileContent} height={550} />
              )}
              {viewerType === ViewerTypes.PDF && (
                <div style={{ height: '600px' }}>
                  <PdfViewer
                    data={fileMetadata}
                    height={'80vh'}
                    linkDownload={pdfLink}
                    scaleDefault={0.7}
                    scroll={true}
                  />
                </div>
              )}
              {viewerType === ViewerTypes.ARCHVE && (
                <NoDataContainer>
                  Content of this file cannot be displayed
                </NoDataContainer>
              )}
            </>
          )}
        </>
      </ErrorBoundary>
    </FileViewerContainer>
  );
};
