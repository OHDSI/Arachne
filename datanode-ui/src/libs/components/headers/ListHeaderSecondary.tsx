
import React from 'react';
import { ListHeaderProps } from './ListHeader.types';
import { Grid } from '../Grid';
import { transparentize } from 'polished';
import { Icon } from '../Icon/Icon';
import { Box, Typography } from '@mui/material';
import { Button } from '../Button/Button';

export const ListHeaderSecondary: React.FC<
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
  count,
  dense = false,
}) => {
    return (
      <>
        <Grid
          container
          mt={dense ? 1 : 2}
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
          >
            {iconName && (
              <Grid item>
                <Grid
                  item
                  sx={theme => ({
                    backgroundColor: transparentize(0.8, theme.palette.info.main),
                    borderRadius: '50%',
                    padding: 0.5,
                    width: 30,
                    height: 30,
                    color: 'text.secondary',
                  })}
                >
                  <Icon iconName={iconName} sx={{ fontSize: 22 }} />
                </Grid>
              </Grid>
            )}
            <Grid
              item
              flexGrow={1}
              alignContent="center"
              display="flex"
              alignItems="center"
            >
              <Typography
                variant={dense ? 'h3' : 'h2'}
                className="secondary-header-title"
              >
                {title}
              </Typography>
              {count != null && (
                <Box
                  sx={(theme: any) => ({
                    backgroundColor: transparentize(0.9, theme.palette.info.main),
                    borderRadius: '2px',
                    color: theme.palette.textColor.primary,
                    fontSize: 12,
                    py: '5px',
                    px: '6px',
                    display: 'inline-flex',
                    height: 23,
                    boxSizing: 'border-box',
                    ml: 2,
                  })}
                >
                  {count}
                </Box>
              )}
            </Grid>
            <Grid item className="secondary-header-actions">
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
