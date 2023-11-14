import { Theme } from '@mui/material';
import { setLightness, transparentize } from 'polished';
import styled from '@emotion/styled';

export const menuStyles = (theme: Theme) => ({
  padding: 0,
  borderRadius: (theme.shape?.borderRadius || 0) + 'px',
});

export const menuItemStyles: any = (theme: Theme) => ({
  padding: '8px 16px',
  fontSize: '0.9rem',
  fontWeight: 400,
  color: theme.palette?.grey[800] || 'grey',
  '&:hover': {
    backgroundColor: transparentize(0.9, theme.palette.info.main),
  },
  '&.Mui-disabled': { backgroundColor: theme.palette.grey[100], opacity: 0.9 },
  '&.Mui-disabled *': {
    color: theme.palette.grey[800],
    backgroundColor: theme.palette.grey[400],
    opacity: 1,
    filter: 'grayscale(1)',
  },
  '&.Mui-selected': {
    backgroundColor: transparentize(0.8, theme.palette.info.main),
  },
});

export const menuContainerStyles = (theme: Theme) => ({
  borderRadius: (theme.shape?.borderRadius || 0) + 'px',
});

export const IconWrapper = styled.div`
  position: relative;
  top: 2px;
  display: inline-block;
  margin-right: 5px;
`;

export const Line = styled.div`
  border-bottom: 1px solid #c3cad1;
`;
