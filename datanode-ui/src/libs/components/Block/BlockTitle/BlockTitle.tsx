import React, { FC } from 'react';
import type { IBlockTitleProps } from './BlockTitle.types';
import {
  BlockTitleContainer,
  BlockTitleStartIcon,
  BlockTitleText,
} from './BlockTitle.styles';
import { Grid } from '@mui/material';

export const BlockTitle: FC<IBlockTitleProps> = props => {
  const { title, startIcon } = props;
  return (
    <BlockTitleContainer className="content-block__title">
      <Grid display="flex" item alignItems="center">
        {startIcon && <BlockTitleStartIcon>{startIcon}</BlockTitleStartIcon>}
        {title && (
          <BlockTitleText className="content-block__title-text">
            {title}
          </BlockTitleText>
        )}
      </Grid>
      {props.children}
    </BlockTitleContainer>
  );
};
