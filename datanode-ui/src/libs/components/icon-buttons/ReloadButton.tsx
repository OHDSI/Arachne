import React from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';


export interface ReloadButtonProps {
  onClick: (e) => void;
  iconSize?: number;
}

export const ReloadButton: React.FC<ReloadButtonProps> = props => {
  const { onClick, iconSize = 18 } = props;

  return (
    <Button
      size="xsmall"
      sx={{ width: 26, height: 26, minWidth: 0 }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      <Icon iconName="reload" sx={{ fontSize: iconSize, opacity: 0.6 }} />
    </Button>
  );
};