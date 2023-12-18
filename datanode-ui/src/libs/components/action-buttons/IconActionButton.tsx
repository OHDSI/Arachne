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

import { FC } from "react";
import { darken } from "polished";
import { IconButton } from "@mui/material";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";

export const IconActionButton: FC<{
  onClick: () => void;
  color: any;
  iconName: any;
  tooltipText?: string;
  disabled?: boolean;
  name?: string;
}> = ({ onClick, color, iconName, tooltipText = "", disabled, name }) => {
  return (
    <Tooltip text={tooltipText}>
      <div>
        <IconButton
          sx={(theme: any) => ({
            borderRadius: 0.5,
            p: 0.75,
            bgcolor: theme.palette.backgroundColor.dark,
            "&.Mui-disabled": {
              bgcolor: theme.palette.backgroundColor.dark,
            },
            "&:hover": {
              bgcolor: darken(0.05, theme.palette.backgroundColor.dark),
            },
          })}
          disabled={disabled}
          onClick={onClick}
          name={name}
        >
          <Icon
            iconName={iconName}
            sx={theme => ({
              fontSize: 16,
              color: disabled
                ? theme.palette["default"]?.main
                : theme.palette[color]?.main,
              opacity: disabled ? 0.3 : 0.75,
            })}
          />
        </IconButton>
      </div>
    </Tooltip>
  );
};
