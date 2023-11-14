import { TextField, styled, Theme } from '@mui/material';
import { getColor } from '../common/utils';

export const StyledField: any = styled(TextField, {
  shouldForwardProp: prop => prop !== 'size',
}) <{
  size?: 'small' | 'medium' | 'large';
}>`
  .datepicker {
    svg {
      font-size: 16px;
    }
    &-input-root {
      padding: ${({ size }) => (size == 'small' ? '4px 6px' : '4px 10px')};
      border-radius: ${({ theme }: any) =>
    theme.shape?.borderRadius || 0}px;
      background-color: #ffffff;
      &:not([class*='Mui-focused']):hover
        [class*='MuiOutlinedInput-notchedOutline'] {
        border-color: ${({ theme }: any) => getColor(theme)(0.7)};
      }
      .datepicker-notched-outline {
        border-color: ${({ theme }: any) =>
    theme.palette?.borderColor.main};
      }
    }
    &-input {
      padding: 0;
      height: ${({ size }: any) =>
    size == 'small' ? '16px' : '20px'};
      font-size: ${({ size }: any) =>
    size == 'small' ? '12px' : '14px'};
    }
    &-adornment {
      width: 30px;
      height: ${({ size }: any) =>
    size == 'small' ? '18px' : '22px'};
      margin-left: 0;
    }
    &-focused,
    &-error {
      fieldset.datepicker-notched-outline {
        border-width: 1px;
      }
    }
    &-focused {
      fieldset.datepicker-notched-outline {
        border-color: ${({ theme }: { theme: Theme }) =>
    theme.palette?.primary.main || 'lightgrey'};
      }
    }
    &-error {
      fieldset.datepicker-notched-outline {
        border-color: ${({ theme }: { theme: Theme }) =>
    theme.palette?.error.main || 'red'};
      }
    }
    &-button {
      padding: 8px;
    }
    &-button-icon {
      svg {
        color: ${({ theme }: { theme: Theme }) => getColor(theme)(0.5)};
      }
    }
  }
`;
