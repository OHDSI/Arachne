
import React from 'react';

import { useNavigate } from 'react-router';

import { Button, Grid, Icon } from '../../../libs/components';
import { Typography, useTheme } from '@mui/material';
import { EditableInput } from '../../../libs/components/editable-controls/EditableInput';
import { StatusTag } from '../../../libs/components/Table';
import { IconActionButton } from '../../../libs/components/action-buttons';
import { getFormatDateAndTime } from '../../../libs/utils/getFormatDate';

export interface DatabaseBaseInfoProps {
  entity: any;
  Status?: React.ReactNode;
  onSubmit: (val: any) => any;
  onDelete: () => any;
  onPublish: () => any;
  onExecute?: () => any;
}
export const DatabaseBaseInfo: React.FC<DatabaseBaseInfoProps> = ({
  entity,
  onSubmit,
  onDelete,
  onPublish,
}) => {
  const navigate = useNavigate();
  const theme: any = useTheme();
  // const viewMode = React.useMemo(
  //   () =>
  //     !Boolean(
  //       entity?.actions ? entity?.actions?.includes(EntityActions.UPDATE) : true
  //     ),
  //   [entity?.actions]
  // );
  const updateFiled = (fieldName: any, newValue: any) => {
    onSubmit({ ...entity, [fieldName]: newValue });
  };

  return (
    <Grid container py={1.5} pb={2} alignItems="center" spacing={0.5}>
      <Grid item xs={12} container alignItems="center">
        <Grid item flexGrow={1} mx={-1}>
          <EditableInput
            size="medium"
            value={entity?.name}
            fullWidth
            color={theme.palette.textColor.primary}
            onSubmit={function (value): void {
              updateFiled('name', value);
            }}
            name="database-name"
            required
          />
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Grid item>
            <Button size="xsmall" color="info" onClick={() => navigate('..')}>
              {'<'} Back to Databases
            </Button>
          </Grid>
          <Grid
            item
            mx={1}
            sx={{
              '.status-tag': {
                height: 24,
                lineHeight: '24px',
                mx: 0,
              },
            }}
          >
            {/* {entity?.published?.length > 0 ? (
              <StatusTag text="Published" color="success" />
            ) : (
              <Button
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onPublish?.();
                }}
                color="info"
                variant="outlined"
                disabled={true}
                startIcon={<Icon iconName="publish" />}
                sx={{
                  px: 2,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: 12,
                  minWidth: 98,
                }}
              >
                Publish
              </Button>
            )}{' '} */}
          </Grid>
          <Grid item ml={1}>
            <IconActionButton
              color="error"
              iconName="delete"
              onClick={onDelete}
              tooltipText="Delete"
              name="analysis-delete"
            />
          </Grid>
        </Grid>
      </Grid>{' '}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item flexGrow={1} display="flex">
            <Grid item mr={2}>
              <Typography
                variant="subtitle2"
                component="label"
                sx={{ mr: 0.5 }}
              >
                Created date:
              </Typography>
              <Typography variant="subtitle2" component="span" fontWeight={600}>
                {getFormatDateAndTime(entity?.created?.timestamp)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="subtitle2"
                component="label"
                sx={{ mr: 0.5 }}
              >
                Updated date:
              </Typography>
              <Typography variant="subtitle2" component="span" fontWeight={600}>
                {getFormatDateAndTime(entity?.modified?.timestamp)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} mx={-1}>
        <EditableInput
          size="small"
          value={entity?.description}
          fullWidth
          color={theme.palette.textColor.primary}
          onSubmit={function (value): void {
            updateFiled('description', value);
          }}
          name="database-description"
          multiline
          maxRows={3}
        />
      </Grid>
    </Grid>
  );
};
