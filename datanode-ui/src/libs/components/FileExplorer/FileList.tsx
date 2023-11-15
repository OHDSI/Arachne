import React from 'react';
import { FileListContainer } from './FileExplorer.styles';
import { FileItem } from './FileItem';
import { Grid } from '../Grid';
import { Typography } from '@mui/material';

export const FileList: React.FC<any> = props => {
  const { selectedFile, selectFile, status, subList, fileTree } = props;
  const data = fileTree?.__size__ > 0 ? Object.values(fileTree) : [];
  data.sort((a: any, b: any) => {
    if (a.__type__ < b.__type__) return 1;
    if (a.__type__ > b.__type__) return -1;
    return 0;
  });

  return (
    <FileListContainer subList={subList}>
      <Grid container>
        {data?.length > 0 ? (
          data.map((item, index) => {
            return (
              <Grid item xs={12} key={index}>
                <FileItem
                  subList={subList}
                  files={fileTree}
                  selectedFile={selectedFile}
                  selectFile={selectFile}
                  item={item}
                  status={status}
                />
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography py={3} variant="h2" align="center">
              No files to display
            </Typography>
          </Grid>
        )}
      </Grid>
    </FileListContainer>
  );
};
