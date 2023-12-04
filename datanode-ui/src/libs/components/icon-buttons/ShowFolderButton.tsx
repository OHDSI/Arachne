import React from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';


export interface ShowFolderButtonProps {
  onClick: (e) => void;
  iconSize?: number;
}

export const ShowFolderButton: React.FC<ShowFolderButtonProps> = props => {
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
      <Icon iconName="showFolder" sx={{ fontSize: iconSize, opacity: 0.6 }} />
    </Button>
  );
};