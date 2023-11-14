import { styled } from '@mui/material/styles';
import { transparentize } from 'polished';

export const NoDataText: any = styled('div')`
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }: any) =>
    transparentize(0.5, theme.palette?.primary.main)};
`;
