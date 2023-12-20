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
import { StyledRadio } from "./Radio.styles";

export type RadioProps = {
  value?: any;
  checked: boolean;
  onChange: (newValue: any) => void;
  name?: string;
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "default";
  disabled?: boolean;
  required?: boolean;
  className?: string;
};
export const Radio: React.FC<RadioProps> = props => {
  const {
    value,
    checked,
    onChange,
    name = "radio",
    size = "medium",
    disabled,
    required,
    color = "primary",
    className = "",
  } = props;
  return (
    <StyledRadio
      name={name}
      disableRipple
      checked={checked}
      onChange={onChange}
      inputProps={{ "aria-label": "radio" }}
      size={size}
      disabled={disabled}
      required={required}
      color={color}
      value={value}
      className={className + " c-radio"}
      classes={{
        root: "radio-root",
        checked: "radio-checked",
        disabled: "radio-disabled",
      }}
    />
  );
};
