import React, { FC, useState } from 'react';

import { useTheme } from '@emotion/react';
import JSZip from 'jszip';
import { useNotifications } from '../Notification';
import { Grid } from '../Grid';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton, Typography } from '@mui/material';

export const ImportZipFile: FC<any> = props => {
  const { onChange, titleButton = 'Upload file' } = props;
  const { enqueueSnackbar } = useNotifications();
  const [currentFile, setCurrentFile] = useState(null);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        p={1.5}
        border="2px dashed"
        borderColor="borderColor.main"
        container
        alignItems="center"
        flexWrap="nowrap"
      >
        <Grid item>
          <Button
            variant="contained"
            // @ts-ignore
            component="label"
            color="info"
            size="small"
            startIcon={<Icon iconName="upload" />}
            sx={{ minWidth: 150 }}
          >
            {titleButton}
            <input
              type="file"
              accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
              onChange={e => {
                const archive = e.target.files[0];
                const zip = new JSZip();
                zip.loadAsync(archive).then(files_zip => {
                  setCurrentFile(archive);
                  onChange(files_zip, archive);
                });
                // readFile(file);
              }}
              hidden
            />
          </Button>{' '}
        </Grid>
        <Grid item flexGrow={1} ml={2} display="flex" alignItems="center">
          {currentFile ? (
            <>
              <Typography
                sx={{ maxWidth: 'calc(100% - 30px)', wordBreak: 'break-all' }}
              >
                {currentFile?.name}
              </Typography>
              {/* if you don't need button just comment this */}
              <IconButton
                size="small"
                color="error"
                sx={{ p: 0.5, ml: 1 }}
                onClick={() => {
                  setCurrentFile(undefined);
                  onChange(undefined);
                }}
              >
                <Icon iconName="delete" sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          ) : (
            <Typography
              variant="subtitle2"
              sx={(theme: any) => ({ color: theme.palette.borderColor.main })}
            >
              Choose file to upload
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
