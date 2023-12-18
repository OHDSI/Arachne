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

import clsx from "clsx";
import React from "react";
import { StyledInput } from "./Input.styles";
import { TextFieldProps as MuiInputProps } from "@mui/material";

export type InputProps = Omit<MuiInputProps, "size"> & {
  min?: number;
  max?: number;
  pattern?: any;
  size?: MuiInputProps["size"] | "large";
};

export const Input: React.FC<InputProps> = props => {
  const {
    type = "text",
    className,
    pattern,
    min,
    max,
    size,
    id,
    variant,
    ...rest
  } = props;

  return (
    <StyledInput
      {...rest}
      className={clsx("input", type, className)}
      variant={variant}
      margin="dense"
      classes={{
        root: "input",
        ...rest.classes,
      }}
      inputProps={{
        pattern,
        min,
        max,
        type,
        ...(id ? { id } : {}),
        ...rest.inputProps,
      }}
      InputProps={{
        size: size as any,
        className: "input-" + size,
        classes: {
          root: "input-root",
          focused: "input-focused",
          notchedOutline: "input-notched-outline",
          input: "input-base",
          sizeSmall: "input-small",
        } as any,
        ...rest.InputProps,
      }}
    />
  );
};
