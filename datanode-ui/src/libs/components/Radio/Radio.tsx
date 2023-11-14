import React from 'react';
import { StyledRadio } from './Radio.styles';

export type RadioProps = {
  value?: any;
  checked: boolean;
  onChange: (newValue: any) => void;
  name?: string;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  required?: boolean;
  className?: string;
};
export const Radio: React.FC<RadioProps> = props => {
  const {
    value,
    checked,
    onChange,
    name = 'radio',
    size = 'medium',
    disabled,
    required,
    color = 'primary',
    className = '',
  } = props;
  return (
    <StyledRadio
      name={name}
      disableRipple
      checked={checked}
      onChange={onChange}
      inputProps={{ 'aria-label': 'radio' }}
      size={size}
      disabled={disabled}
      required={required}
      color={color}
      value={value}
      className={className + ' c-radio'}
      classes={{
        root: 'radio-root',
        checked: 'radio-checked',
        disabled: 'radio-disabled',
      }}
    />
  );
};
