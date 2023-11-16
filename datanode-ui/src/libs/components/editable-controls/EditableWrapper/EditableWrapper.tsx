import React from 'react';
import { StyledInputWrapper } from './EditableWrapper.styles';
import { ClickAwayListener } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { EditableComponentActions } from '../EditableComponentActions';

export interface WrapperProps {
  onSubmit: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  active: boolean;
  showActions?: boolean;
  disabled?: boolean;
  disableSubmit?: boolean;
  submitErrorMessage?: string;
  multiline?: boolean;
}
export const EditableWrapper: React.FC<WrapperProps> = ({
  children,
  onCancel,
  onSubmit,
  active,
  showActions = false,
  disabled = false,
  disableSubmit = false,
  submitErrorMessage,
  multiline = false,
}) => {
  const handleActions = e => {
    if (e.key === 'Escape') {
      onCancel?.();
    }
    if (e.key === 'Enter') {
      if (!multiline) {
        e?.preventDefault();
      }
      if (!e.ctrKey && !e.metaKey && !e.shiftKey && !disableSubmit) {
        if (!disableSubmit) {
          onSubmit?.();
        } else {
          enqueueSnackbar({
            message: submitErrorMessage,
            variant: 'error',
          });
        }
      }
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        active && onCancel();
      }}
      mouseEvent="onMouseDown"
      disableReactTree={disabled}
    >
      <StyledInputWrapper disabled={disabled} onKeyDown={handleActions}>
        {children}
        {active && !disabled && showActions && (
          <EditableComponentActions
            onCancel={onCancel}
            onSubmit={onSubmit}
            submitErrorMessage={submitErrorMessage}
            disableSubmit={disableSubmit}
          />
        )}
      </StyledInputWrapper>
    </ClickAwayListener>
  );
};
