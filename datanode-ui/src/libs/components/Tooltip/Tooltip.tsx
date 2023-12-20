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

import {
  StyledTooltip,
  LightTooltip as StyledLightTooltip,
} from "./Tooltip.styles";
import { TooltipProps as MUITooltipProps } from "@mui/material";

export interface TooltipProps {
  text: string | React.ReactNode;
  controlled?: boolean;
  show?: boolean;
  width?: number | string;
  color?: "primary" | "secondary";
  disabled?: boolean;
  disableOpacity?: boolean;
  placement?: any;
  children: any;
  arrow?: boolean;
  className?: any;
  sx?: MUITooltipProps["sx"];
}

export const Tooltip: React.FC<TooltipProps> = props => {
  const {
    children,
    text,
    show = false,
    disabled,
    placement = "top",
    controlled,
    arrow = true,
    color,
    sx,
  } = props;

  return controlled ? (
    <StyledTooltip
      title={text}
      placement={placement}
      open={show}
      arrow={arrow}
      color={color}
      sx={sx}
    >
      {children}
    </StyledTooltip>
  ) : (
    <StyledTooltip
      title={text}
      placement={placement}
      arrow={arrow}
      disableHoverListener={disabled}
      color={color}
      sx={sx}
    >
      {children}
    </StyledTooltip>
  );
};

export const LightTooltip: React.FC<TooltipProps> = props => {
  const {
    children,
    text,
    show = false,
    disabled,
    placement = "top",
    controlled,
    arrow = false,
    color,
  } = props;

  return controlled ? (
    <StyledLightTooltip
      title={text}
      placement={placement}
      open={show}
      arrow={arrow}
      color={color}
    >
      {children}
    </StyledLightTooltip>
  ) : (
    <StyledLightTooltip
      title={text}
      placement={placement}
      arrow={arrow}
      disableHoverListener={disabled}
      color={color}
    >
      {children}
    </StyledLightTooltip>
  );
};
