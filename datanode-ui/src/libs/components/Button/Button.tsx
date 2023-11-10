import { ButtonProps as Props } from '@mui/material/Button';
import React from 'react';
import { StyledButton } from './Button.styles';

// declare module '@mui/material/Button' {
//   interface ButtonPropsSizeOverrides {
//     xsmall: true;
//   }
// }
export type ButtonProps = Omit<Props, 'size'> & {
  size?: Props['size'] | 'xsmall';
};

export const Button: React.FC<ButtonProps> = React.forwardRef((props, ref) => {
  const size = React.useMemo(
    () => (props.size === 'xsmall' ? 'small' : props.size) || 'medium',
    [props.size]
  );
  return (
    <StyledButton
      ref={ref}
      {...props}
      size={size}
      buttonSize={props.size}
      classes={{
        startIcon: 'start-icon start-icon-' + size,
        endIcon: 'end-icon end-icon-' + size,
      }}
    >
      {props.children}
    </StyledButton>
  );
});
