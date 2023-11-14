import { Button, useTheme } from '@mui/material';
import React from 'react';
import { TitleLayout } from './Modal.styles';
import { Icon } from '../Icon/Icon';

export const ModalTitle: React.FC<{
  children?: React.ReactNode;
  onClose?: () => void;
}> = props => {
  return (
    <TitleLayout>
      <div className="modal-title">{props.children}</div>
      {props.onClose && (
        <Button
          onClick={props.onClose}
          name="closeModal"
          sx={{ minWidth: 0, p: 0.5 }}
        >
          <Icon iconName="deactivate" fontSize="small" />
        </Button>
      )}
    </TitleLayout>
  );
};
