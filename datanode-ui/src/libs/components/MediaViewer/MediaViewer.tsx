import React, { FC } from 'react';
import { CsvViewer } from '../CsvViewer';
import { CodeEditor } from '../CodeEditor';
import { ImageViewer } from '../ImageViewer';
import { PdfViewer } from '../PdfViewer';
import { MediaViewerDefaultContent } from './MediaViewer.styles';
import type { IMediaViewerProps } from './MediaViewer.types';
import { MediaType } from '../../enums/MediaType';

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
