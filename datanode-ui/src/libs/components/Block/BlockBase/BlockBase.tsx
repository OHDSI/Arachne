import React, { FC } from 'react';
import { BlockBaseContainer } from './BlockBase.styles';
import { IBlockBaseProps } from './BlockBase.types';

export const BlockBase: FC<IBlockBaseProps> = props => {
  const {
    children,
    className = '',
    isDark = false,
    minHeight,
    elevated,
  } = props;

  return (
    <BlockBaseContainer
      className={className + ' content-block'}
      isDark={isDark}
      minHeight={minHeight}
      elevated={elevated}
    >
      {children}
    </BlockBaseContainer>
  );
};
