import React from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material';
import { Icon } from '../Icon/Icon';

export type CheckboxProps = MuiCheckboxProps & { stopPropagation?: boolean };

export const Checkbox: React.FC<CheckboxProps> = props => {
  const { stopPropagation, onClick, ...rest } = props;

  return (
    <MuiCheckbox
      icon={<Icon iconName="checkboxEmpty" />}
      checkedIcon={<Icon iconName="checkboxSelected" />}
      indeterminateIcon={<Icon iconName="checkboxIndeterminate" />}
      {...rest}
      onClick={e => {
        onClick && onClick(e);
        stopPropagation && e.stopPropagation();
      }}
      classes={{
        root: 'app-checkbox',
      }}
      sx={{
        padding: 0,
        ...(props.disabled ? { opacity: 0.5, filter: 'saturate(0)' } : {}),
        ...rest.sx,
      }}
    />
  );
};
