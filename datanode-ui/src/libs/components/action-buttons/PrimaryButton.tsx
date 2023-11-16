
import React, { FC, ReactNode } from 'react';
import { ButtonProps } from './Button.types';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export const PrimaryButton: FC<ButtonProps> = ({
  onClick,
  size,
  children,
  iconName,
  tooltipText = '',
  id,
  name,
  className,
}) => {
  return (
    <Tooltip text={tooltipText}>
      <Button
        id={id}
        name={name}
        className={className}
        color="info"
        variant="contained"
        onClick={onClick}
        size={size}
        sx={{
          fontSize: { xsmall: 14, small: 16 }[size] || 14,
          px: 2,
          fontWeight: 600,
        }}
        startIcon={<Icon iconName={iconName} />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
