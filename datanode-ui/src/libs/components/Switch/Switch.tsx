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

import React, { FC } from "react";
import { StyledSwitch } from "./Switch.styles";
import { SwitchProps as MUISwitchProps } from "@mui/material";
import clsx from "clsx";

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  className?: string;
  color?: MUISwitchProps["color"];
  disabled?: boolean;
  onChange?: (event?: any) => void;
  required?: boolean;
  size?: "medium" | "small";
  value: any;
  type?: "square" | "round";
  name?: string;
}

export const Switch: FC<SwitchProps> = props => {
  return (
    <StyledSwitch
      id={props.id}
      className={clsx(props.className, props.type)}
      focusVisibleClassName={clsx("c-switch", props.className)}
      disableRipple
      classes={{
        root: "switch-root",
        switchBase: clsx("switch-base", {
          "switch-base-small": props.size === "small",
        }),
        thumb: "switch-thumb",
        track: "switch-track",
        checked: "switch-checked",
      }}
      size={props.size}
      checked={props.checked}
      disabled={props.disabled}
      onChange={(event: any) => props.onChange && props.onChange(event)}
      required={props.required}
      value={props.value}
      color={props.color || "primary"}
      name={props.name}
    />
  );
};
