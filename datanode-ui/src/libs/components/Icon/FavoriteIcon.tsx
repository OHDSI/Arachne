/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

import { ReactComponent as Favorite } from "../icons/favorite.svg";
import { ReactComponent as FavoriteSelected } from "../icons/favorite-selected.svg";

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
    const Svg: any = favoriteIcon[selected ? "iconSelected" : "icon"];
    return (
      <SvgIcon
        {...props}
        ref={ref}
        sx={{
          color: props.color || "info",
          fontSize: props.size,
        }}
      >
        <Svg color={props.color} />
      </SvgIcon>
    );
  }
);
