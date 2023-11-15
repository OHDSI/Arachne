import styled, { StyledComponent } from '@emotion/styled';
import { AnyAction } from 'redux';


export const TabsContainer: any = styled('div', { shouldForwardProp: prop => prop !== 'secondary' })(
  ({ theme, secondary }: any) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 0,
    '.tab': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      padding: '14px 12px',
      fontSize: secondary ? 14 : 16,
      fontWeight: 400,
      textAlign: 'center',
      color: theme.palette.textColor.primary,
      opacity: 0.8,
      cursor: 'pointer',
      [theme.breakpoints.down('lg')]: {
        padding: '14px',
      },
    },
    '.tab:not(:last-of-type)': {
      marginRight: secondary ? 0 : '12px',
    },
    '.tab.active': {
      fontWeight: 600,
      color: theme.palette.textColor.primary,
    },
    '.tab::after': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      // left: 0,
      height: 4,
      width: '0',
      backgroundColor: theme.palette.info.main,
      transition: '300ms',
      left: '50%',
      transform: 'translateX(-50%, 0)',
    },
    '.tab.active::after': {
      content: "''",
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 4,
      width: '100%',
      backgroundColor: theme.palette.info.main,
    },
  })
);
