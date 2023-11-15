
import { Spinner, SpinnerWidgetContainer } from '../Spinner';
import React from 'react';
import { FileViewer } from '../FileViewer';
import {
  DowloadLink,
  HeaderFileReader,
  HeaderTitle,
} from './FileExplorer.styles';
import { FileList } from './FileList';
import { NoDataContainer } from '../FileViewer/FileViewer.styles';
import { Grid } from '../Grid';
import { Status } from '../../enums'
import { useFileExplorer } from '../../hooks/useFileExplorer';
import { Paper } from '@mui/material';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface FileExplorerPropsInterface {
  submissionId: string;
  url: string;
  noDataMessage?: string;
}

export const FileExplorer: React.FC<FileExplorerPropsInterface> = props => {
  const { submissionId, url, noDataMessage = 'Results are empty' } = props;

  const { fileTree, status, selectedFile, filesContent, selectFile } =
    useFileExplorer(submissionId, url);

  if ([Status.INITIAL, Status.IN_PROGRESS].includes(status)) {
    return (
      <Grid item xs={12} py={'100px'}>
        <SpinnerWidgetContainer>
          <Spinner size={30} />
        </SpinnerWidgetContainer>
      </Grid>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      {fileTree?.__size__ === 0 ? (
        <Grid item xs={12}>
          <NoDataContainer>{noDataMessage}</NoDataContainer>
        </Grid>
      ) : (
        <Grid container border="1px solid" borderColor="borderColor.main">
          <Grid item xs={12}>
            <HeaderFileReader>
              <Grid container>
                <Grid
                  item
                  xs={3}
                  style={{
                    paddingRight: '21px',
                    borderRight: '1px solid',
                  }}
                >
                  <HeaderTitle>File Explorer</HeaderTitle>
                  <DowloadLink>
                    <a
                      href={`/api/${url}/${submissionId}/results/download`}
                      target="_blank"
                    >
                      <Button
                        variant="outlined"
                        size="xsmall"
                        name="download-all-result-files"
                        startIcon={<Icon iconName="import" />}
                      >
                        Download All
                      </Button>
                    </a>
                  </DowloadLink>
                </Grid>
                <Grid item xs={9}>
                  {selectedFile && (
                    <>
                      <HeaderTitle marginLeft="20px">
                        {selectedFile.__name__}
                      </HeaderTitle>
                      <DowloadLink>
                        <a
                          href={`/api/${url}/${submissionId}/results/${selectedFile?.id}/download`}
                          target="_blank"
                        >
                          <Button
                            variant="outlined"
                            size="xsmall"
                            startIcon={<Icon iconName="import" />}
                          >
                            Download
                          </Button>
                        </a>
                      </DowloadLink>
                    </>
                  )}
                </Grid>
              </Grid>
            </HeaderFileReader>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={3}
                borderRight="1px solid"
                borderColor="borderColor.main"
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                <FileList
                  fileTree={fileTree}
                  // files={files}
                  // filesList={files}
                  status={status}
                  selectedFile={selectedFile}
                  selectFile={selectFile}
                />
              </Grid>
              <Grid item xs={9} sx={{ height: 'calc(100vh - 250px)' }}>
                <FileViewer
                  fileContent={filesContent?.[selectedFile.id]}
                  fileMetadata={selectedFile}
                  status={status}
                  pdfLink={`/api/${url}/${submissionId}/results/${selectedFile?.id}/download`}
                  height={'calc(100vh - 250px)'}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};
