import React from 'react';

import { ConfirmationDialog, ConfirmationDialogProps } from '../Dialogs';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { DialogContext, UseDialogContext } from '../../hooks/useDialog';

export interface RemoveButtonProps {
  onRemove: (e?: React.MouseEvent) => void;
  withConfirmation?: boolean;
  confirmationMessage?: string;
  iconSize?: number;
}

export const RemoveButton: React.FC<RemoveButtonProps> = props => {
  const {
    onRemove,
    withConfirmation = false,
    confirmationMessage = 'Are you sure you want to delete this item?',
    iconSize = 18,
  } = props;
  const dialogContext = React.useContext<UseDialogContext>(DialogContext);

  const onDelete = (e: React.MouseEvent) => {
    e?.stopPropagation();
    onRemove(e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (withConfirmation && dialogContext) {
      dialogContext.showDialog<ConfirmationDialogProps>(ConfirmationDialog, {
        onSubmit: () => onDelete(e),
        onClose: dialogContext?.hideDialog,
        text: confirmationMessage,
        confirmButtonText: 'DELETE',
      });
    } else {
      onDelete(e);
    }
  };

  return (
    <Button
      size="xsmall"
      onClick={handleDelete}
      sx={{ width: 26, height: 26, minWidth: 0 }}
    >
      <Icon
        iconName="delete"
        sx={{ fontSize: iconSize, opacity: 0.6 }}
        color="error"
      />
    </Button>
  );
};
