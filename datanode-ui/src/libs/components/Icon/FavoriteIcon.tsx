import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Favorite } from '../icons/favorite.svg';
import { ReactComponent as FavoriteSelected } from '../icons/favorite-selected.svg';

export const favoriteIcon: { [key: string]: React.FC<any> } = {
  icon: Favorite,
  iconSelected: FavoriteSelected,
};
export type FavoriteIconName = keyof typeof favoriteIcon;
export type FavoriteIconProps = SvgIconProps & {
  selected: boolean;
  size: number;
};

export const FavoriteIcon: React.FC<FavoriteIconProps> = React.forwardRef(
  ({ selected, ...props }, ref) => {
    const Svg: any = favoriteIcon[selected ? 'iconSelected' : 'icon'];
    return (
      <SvgIcon
        {...props}
        ref={ref}
        sx={{
          color: props.color || 'info',
          fontSize: props.size,
        }}
      >
        <Svg color={props.color} />
      </SvgIcon>
    );
  }
);
