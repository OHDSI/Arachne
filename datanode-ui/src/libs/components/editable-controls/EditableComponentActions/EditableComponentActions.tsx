import { Button, Tooltip } from '@mui/material';
import React from 'react';
import { Icon } from '../../Icon/Icon';
import { Grid } from '../../Grid';

export const EditableComponentActions: React.FC<{
  onSubmit: () => void;
  onCancel: () => void;
  disableSubmit?: boolean;
  submitErrorMessage?: string;
}> = ({ onSubmit, onCancel, disableSubmit, submitErrorMessage = '' }) => {
  return (
    <Grid className="editable-component-actions" container>
      <Tooltip
        title={disableSubmit && submitErrorMessage ? submitErrorMessage : ''}
      >
        <div>
          <Button
            name="editable-component-save"
            sx={theme => ({
              minWidth: 0,
              p: 0,
              backgroundColor: '#ffffff',
              height: 30,
              width: 30,
              '&.Mui-disabled': {
                backgroundColor: 'backgroundColor.main',
                boxShadow: theme.shadows[2],
              },
            })}
            color="inherit"
            variant="contained"
            onClick={onSubmit}
            disabled={disableSubmit}
          >
            <Icon
              iconName="check"
              color={disableSubmit ? 'disabled' : 'success'}
            />
          </Button>
        </div>
      </Tooltip>
      <Button
        name="editable-component-cancel"
        sx={{
          minWidth: 0,
          p: 0,
          backgroundColor: '#ffffff',
          height: 30,
          width: 30,
          ml: 0.5,
        }}
        color="inherit"
        variant="contained"
        onClick={onCancel}
      >
        <Icon iconName="deactivate" color="error" sx={{ fontSize: 16 }} />
      </Button>
    </Grid>
  );
};
