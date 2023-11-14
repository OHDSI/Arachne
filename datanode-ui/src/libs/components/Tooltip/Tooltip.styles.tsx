import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { transparentize } from 'polished';
import React, { FC } from 'react';

// import { TooltipProps } from './Tooltip';

export const StyledTooltip: FC<any> = styled(
  ({ className, ...props }: TooltipProps & { disableOpacity?: boolean }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme, color, disableOpacity }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: 4,
    fontSize: '0.8rem',
    backgroundColor: transparentize(
      disableOpacity ? 0 : 0.2,
      (theme.palette && theme.palette[color]?.main) || '#5e6b8b'
    ),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: transparentize(
      disableOpacity ? 0 : 0.2,
      (theme.palette && theme.palette[color]?.main) || '#5e6b8b'
    ),
  },
}));

export const LightTooltip: FC<any> = styled(
  ({ className, ...props }: TooltipProps & { disableOpacity?: boolean }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    borderRadius: theme.shape.borderRadius,
    // fontSize: '0.8rem',
    backgroundColor: '#fff',
    opacity: 0,
    color: theme.palette.textColor.primary,
    boxShadow: theme.customShadows[1],
    padding: 0,
  },
}));
