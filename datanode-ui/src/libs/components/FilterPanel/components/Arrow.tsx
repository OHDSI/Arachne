import React from 'react';
import { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';

// export const useStyles: any = makeStyles((theme: Theme) => ({
//   arrow: {
//     border: 'solid ' + theme.palette.grey[600],
//     borderWidth: '0 2px 2px 0',
//     display: 'inline-block',
//     padding: 3,
//     transform: 'rotate(-135deg)',
//     '&.down': {
//       transform: 'rotate(45deg)',
//     },
//     '&.right': {
//       transform: 'rotate(-45deg)',
//     },
//     '&.left': {
//       transform: 'rotate(135deg)',
//     },
//   },
// }));

const PREFIX = 'ArrowIcon';
const classes = {
  arrow: `${PREFIX}-arrow`,
};
const Root: any = styled('div')((theme: Theme) => ({
  [`&.${classes.arrow}`]: {
    border: 'solid ' + theme.palette?.grey[600],
    borderWidth: '0 2px 2px 0',
    display: 'inline-block',
    padding: 3,
    transform: 'rotate(-135deg)',
    '&.down': {
      transform: 'rotate(45deg)',
    },
    '&.right': {
      transform: 'rotate(-45deg)',
    },
    '&.left': {
      transform: 'rotate(135deg)',
    },
  },
}));

export const Arrow: React.FC<{
  direction: 'up' | 'down' | 'right' | 'left';
}> = ({ direction }) => {
  return <Root className={classes.arrow + ` ${direction}`}></Root>;
};
