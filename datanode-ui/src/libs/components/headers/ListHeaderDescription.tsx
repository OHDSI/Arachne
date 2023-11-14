
import React from 'react';
import { ListHeaderProps } from './ListHeader.types';
import { Grid } from '../Grid';
import { Typography } from '@mui/material';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
// import { InfoIcon } from '../details';

export const ListHeaderDescription: React.FC<
  ListHeaderProps & { dense?: boolean }
> = ({
  iconName,
  title,
  onImport,
  onCreate,
  importButtonName,
  createButtonName,
  canImport,
  canCreate,
  customButtons,
  dense = false,
}) => {
    return (
      <>
        <Grid
          container
          mt={dense ? 1 : 3}
          borderBottom="1px solid"
          borderColor="borderColor.main"
          minHeight={44}
          boxSizing="border-box"
          className="secondary-header"
        >
          <Grid
            item
            xs={12}
            container
            spacing={2}
            pb={dense ? 1 : 1.5}
            alignItems="center"
            flexWrap="nowrap"
            justifyContent="space-between"
          >
            <Grid
              item
              flexGrow={1}
              alignContent="center"
              display="flex"
              alignItems="center"
              maxWidth="70%"
            >
              <Grid item mr={2}>
                {/* <InfoIcon /> */}
              </Grid>
              <Typography variant="body2" className="secondary-header-title">
                {title}
              </Typography>
            </Grid>
            <Grid
              item
              className="secondary-header-actions"
              flexWrap="nowrap"
              display="flex"
              alignItems="center"
            >
              {customButtons}
              {canImport && (
                <Button
                  onClick={onImport}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  startIcon={<Icon iconName="import" />}
                  name="import"
                  sx={{
                    mr: 2,
                    fontSize: 16,
                    py: 0,
                    px: 2,
                    color: 'info.main',
                    borderColor: 'borderColor.main',
                    whiteSpace: 'nowrap',
                    '.start-icon-small svg': {
                      fontSize: 16,
                      opacity: 0.75,
                    },
                  }}
                  className={'import-' + iconName}
                >
                  {importButtonName || 'Import'}
                </Button>
              )}
              {canCreate && (
                <Button
                  onClick={onCreate}
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<Icon iconName="add" />}
                  className={'create-' + iconName}
                  name="create"
                  sx={{
                    fontSize: 16,
                    height: 30,
                    px: 2,
                    whiteSpace: 'nowrap',
                    '.start-icon-small svg': {
                      fontSize: 18,
                      opacity: 0.75,
                    },
                  }}
                >
                  {createButtonName || 'Create'}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };
