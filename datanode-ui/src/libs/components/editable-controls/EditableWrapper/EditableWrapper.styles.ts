import { styled } from '@mui/material';
import { shouldForwardProp } from '@mui/system';

export const StyledInputWrapper = styled('form', {
  shouldForwardProp: prop => prop !== 'disabled',
})<{ disabled: boolean }>(({ theme, disabled }) => ({
  position: 'relative',
  pointerEvents: disabled ? 'none' : 'auto',
  '.editable-component-actions': {
    position: 'absolute',
    right: 0,
    bottom: 'calc(-30px - 4px)',
    display: 'inline-flex',
    width: 'auto',
    zIndex: 2,
  },
}));
