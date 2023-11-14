import React from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';


export interface EditButtonProps {
  onEdit: (e) => void;
  iconSize?: number;
}

/** @deprecated - probably not used anymore */
export const EditButton: React.FC<EditButtonProps> = props => {
  const { onEdit, iconSize = 18 } = props;

  return (
    <Button
      size="xsmall"
      sx={{ width: 26, height: 26, minWidth: 0 }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(e);
      }}
    >
      <Icon iconName="edit" sx={{ fontSize: iconSize, opacity: 0.6 }} />
    </Button>
  );
};
