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

import React from "react";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";


export interface ShowFolderButtonProps {
  onClick: (e) => void;
  iconSize?: number;
}

export const ShowFolderButton: React.FC<ShowFolderButtonProps> = props => {
  const { onClick, iconSize = 18 } = props;
  return (
    <Button
      size="xsmall"
      sx={{ width: 26, height: 26, minWidth: 0 }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      <Icon iconName="showFolder" sx={{ fontSize: iconSize, opacity: 0.6 }} />
    </Button>
  );
};