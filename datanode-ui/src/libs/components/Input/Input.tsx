import clsx from 'clsx';
import React from 'react';
import { StyledInput } from './Input.styles';
import { TextFieldProps as MuiInputProps } from '@mui/material';

export type InputProps = Omit<MuiInputProps, 'size'> & {
  min?: number;
  max?: number;
  pattern?: any;
  size?: MuiInputProps['size'] | 'large';
};

export const Input: React.FC<InputProps> = props => {
  const {
    type = 'text',
    className,
    pattern,
    min,
    max,
    size,
    id,
    variant,
    ...rest
  } = props;

  return (
    <StyledInput
      {...rest}
      className={clsx('input', type, className)}
      variant={variant}
      margin="dense"
      classes={{
        root: 'input',
        ...rest.classes,
      }}
      inputProps={{
        pattern,
        min,
        max,
        type,
        ...(id ? { id } : {}),
        ...rest.inputProps,
      }}
      InputProps={{
        size: size as any,
        className: 'input-' + size,
        classes: {
          root: 'input-root',
          focused: 'input-focused',
          notchedOutline: 'input-notched-outline',
          input: 'input-base',
          sizeSmall: 'input-small',
        } as any,
        ...rest.InputProps,
      }}
    />
  );
};
