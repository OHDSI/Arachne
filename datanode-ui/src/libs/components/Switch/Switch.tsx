import React, { FC } from 'react';
import { StyledSwitch } from './Switch.styles';
import { SwitchProps as MUISwitchProps } from '@mui/material';
import clsx from 'clsx';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  className?: string;
  color?: MUISwitchProps['color'];
  disabled?: boolean;
  onChange?: (event?: any) => void;
  required?: boolean;
  size?: 'medium' | 'small';
  value: any;
  type?: 'square' | 'round';
  name?: string;
}

export const Switch: FC<SwitchProps> = props => {
  return (
    <StyledSwitch
      id={props.id}
      className={clsx(props.className, props.type)}
      focusVisibleClassName={clsx('c-switch', props.className)}
      disableRipple
      classes={{
        root: 'switch-root',
        switchBase: clsx('switch-base', {
          'switch-base-small': props.size === 'small',
        }),
        thumb: 'switch-thumb',
        track: 'switch-track',
        checked: 'switch-checked',
      }}
      size={props.size}
      checked={props.checked}
      disabled={props.disabled}
      onChange={(event: any) => props.onChange && props.onChange(event)}
      required={props.required}
      value={props.value}
      color={props.color || 'primary'}
      name={props.name}
    />
  );
};
