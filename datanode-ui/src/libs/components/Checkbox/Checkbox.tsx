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
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import { Icon } from "../Icon/Icon";

export type CheckboxProps = MuiCheckboxProps & { stopPropagation?: boolean };

export const Checkbox: React.FC<CheckboxProps> = props => {
  const { stopPropagation, onClick, ...rest } = props;

  return (
    <MuiCheckbox
      icon={<Icon iconName="checkboxEmpty" />}
      checkedIcon={<Icon iconName="checkboxSelected" />}
      indeterminateIcon={<Icon iconName="checkboxIndeterminate" />}
      {...rest}
      onClick={e => {
        onClick && onClick(e);
        stopPropagation && e.stopPropagation();
      }}
      classes={{
        root: "app-checkbox",
      }}
      sx={{
        padding: 0,
        ...(props.disabled ? { opacity: 0.5, filter: "saturate(0)" } : {}),
        ...rest.sx,
      }}
    />
  );
};
