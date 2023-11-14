import { css } from '@emotion/react';
import { getColor } from '../common/utils';
import { Chip, Autocomplete, ChipProps, styled, Theme } from '@mui/material';
import { StyledComponent } from '@emotion/styled';

//  we need to make it as separate component
export const StyledChip: StyledComponent<ChipProps> = styled(Chip)`
  &.chip {
    height: 28px;
    line-height: 22px;
    &-outlined {
      background-color: #f6f7f9;
      border-radius: ${({ theme }: any) => theme.shape?.borderRadius || 0}px;
      border-color: ${({ theme }: any) =>
    theme.palette.borderColor.main};
      color: ${({ theme }: any) => theme.palette.grey[800]};
      font-size: 12px;
      font-weight: 600;
    }
    .chip-delete-outlined {
      font-size: 10px;
      padding: 4px;
    }
  }
`;

export const StyledAutocomplete: StyledComponent<any> = styled(Autocomplete, {
  shouldForwardProp: prop => prop !== 'isDense',
})<{ isDense?: boolean }>(
  ({ isDense, theme }: any) => css`
    &.autocomplete {
      .autocomplete-input {
        height: 14px;
        padding: 8px 10px;
        font-size: 14px;
        &-root {
          min-height: 30px;
          background-color: #ffffff;
        }
      }
      .autocomplete-input-container {
        &.autocomplete-input-root {
          padding: 2px;
          padding-right: 60px;
        }
        &.autocomplete-free-solo-root {
          min-height: 24px;
          /* padding-right: 2px; */
          padding: 1px;
          input {
            font-size: 12px;
            height: 14px;
          }
        }
      }
    }
    .autocomplete-input-container {
      &.autocomplete-focused,
      &.autocomplete-input-container:hover {
        .autocomplete-notched-outline {
          border: 1px solid ${theme.palette?.borderColor.main};
        }
      }
    }
    .autocomplete-notched-outline {
      border-radius: ${theme.shape?.borderRadius || 0}px;
      border-color: ${theme.palette?.borderColor.main};
    }
    .autocomplete-end-adornment {
      right: 2px !important;
      & > * {
        border-radius: ${theme.shape?.borderRadius || 0}px;
        color: ${getColor(theme)(0.6)};
      }
    }
    ${isDense &&
    css`
      &.autocomplete {
        height: 24px;
        .autocomplete-input {
          padding: 6px 8px;
          font-size: 12px;
          .autocomplete-input-root {
            min-height: 22px;
            font-size: 12px;
          }
        }
        .autocomplete-input-container {
          min-height: 24px;
        }
      }
    `}
  `
);
