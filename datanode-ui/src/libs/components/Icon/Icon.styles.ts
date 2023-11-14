import { StyledComponent } from '@emotion/styled';
import { Theme, styled } from '@mui/material';
import { IconProps } from './Icon';

export const IconContainer: StyledComponent<any> = styled('div')`
  width: ${({ size }: any) => size || 24}px;
  height: ${({ size }: any) => size || 24}px;
  display: flex;
  opacity: 0.8;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0;
  justify-content: center;
  color: ${({ color, theme }: { theme: Theme } & IconProps) =>
    color || theme.palette?.primary.main || 'grey'};
  .icon {
    display: inline-block;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
`;
