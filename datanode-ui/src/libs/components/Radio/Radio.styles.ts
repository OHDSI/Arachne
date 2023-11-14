import { Radio, RadioProps, styled, Theme } from '@mui/material';
import { getColor } from '../common/utils';

import { StyledComponent } from '@emotion/styled';

export const StyledRadio: StyledComponent<RadioProps> = styled(Radio)`
  padding: 0;
  &.radio {
    &-checked {
      color: ${({ theme, color }: any) => getColor(theme)(0.6, color)};
    }
    &-disabled {
      color: ${({ theme }: { theme: Theme }) =>
        theme.palette?.action.disabledBackground || 'lightgrey'};
    }
  }
`;
