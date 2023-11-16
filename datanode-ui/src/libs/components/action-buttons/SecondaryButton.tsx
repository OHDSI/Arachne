import React, { FC, ReactNode } from 'react';
import { ButtonProps } from './Button.types';
import { Button } from '../Button/Button';
import { Tooltip } from '../Tooltip/Tooltip';
import { Icon } from '../Icon/Icon';

export const SecondaryButton: FC<ButtonProps> = ({
  onClick,
  size,
  children,
  iconName,
  tooltipText = '',
  id,
  name,
  sx,
}) => {
  return (
    <Tooltip text={tooltipText}>
      <Button
        id={id}
        name={name}
        color="info"
        onClick={onClick}
        variant="outlined"
        size={size}
        startIcon={<Icon iconName={iconName} />}
        sx={(theme: any) => ({
          fontSize: { xsmall: 14, small: 16 }[size] || 14,
          px: 1.5,
          fontWeight: 600,
          borderColor: theme.palette.borderColor.main,
        })}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
