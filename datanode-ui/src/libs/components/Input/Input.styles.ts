
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';

export const StyledInput: any = styled(TextField)`
  margin: 0;
  background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.paper || '#fff'};
  border-radius: ${({ theme }: any) => theme.shape?.borderRadius || 0}px;
  .input-notched-outline {
    border-color: ${({ theme }: any) => theme.palette?.borderColor.main};
  }
  &.number .input-root {
    padding-right: 2px;
  }
  & .input-focused,
  & .input-root:hover {
    .input-notched-outline {
      border: 1px solid #232323;
    }
  }
  &::placeholder {
    color: ${({ theme }: any) => theme.palette?.grey[500] || 'lightgrey'};
  }
  &.number .input-root.input-small {
    padding-right: 2px;
  }
  .input-root {
    min-height: 30px;
    line-height: 28px;
    padding: 5px 10px;
    font-size: 14px;
    font-family: ${({ theme }: any) =>
    theme.typography?.fontFamily || 'sans-serif'};
    border-radius: ${({ theme }: any) => theme.shape?.borderRadius || 0}px;

    &.input-small {
      min-height: 24px;
      font-size: 12px;
      padding: 3px 8px;
      line-height: 24px;
    }
    &.input-large {
      min-height: 48px;
      font-size: 14px;
      padding: 5px 10px;
      /* line-height: 24px; */
    }
  }
  .input-base {
    padding: 0;
  }
`;
