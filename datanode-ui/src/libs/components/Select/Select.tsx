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

import { Global, jsx } from "@emotion/react";
import { Chip, OutlinedInput } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { menuStyles, StyledMenuItem, StyledSelect } from "./Select.styles";
export interface SelectProps {
  native?: boolean;
  multiple?: boolean;
  value: any;
  className?: string;
  options?: Array<{ name: string; value: any; tag?: any }>;
  fullWidth?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  onChange?: (item: any, e: any) => void;
  id?: string;
  name?: string;
  disablePortal?: boolean;
  disabled?: boolean;
  cropItems?: boolean;
}

export const Select: React.FC<SelectProps> = props => {
  const {
    native = false,
    className,
    multiple,
    value,
    options,
    fullWidth,
    placeholder,
    size,
    onChange,
    name,
    disablePortal = false,
    disabled,
    cropItems,
  } = props;

  return (
    <React.Fragment>
      <Global styles={menuStyles}></Global>
      <StyledSelect
        {...(props.id ? { id: props.id } : {})}
        name={name}
        variant="outlined"
        margin="dense"
        native={native}
        multiple={multiple}
        value={value}
        size={size}
        onChange={(e: any) => {
          onChange && onChange(e.target.value, e);
        }}
        fullWidth={fullWidth}
        displayEmpty
        className={clsx(className, "c-select")}
        classes={
          {
          	select: "select-menu",
          	root: "select-root",
          	nativeInput: "native-select-input",
          	icon: "select-icon",
          } as any // ????
        }
        disabled={disabled}
        input={
          <OutlinedInput
            classes={{
              root: "select-base",
              focused: "select-focused",
              notchedOutline: "select-notched-outline",
              input: "select-base",
              sizeSmall: "select-small",
            }}
          />
        }
        MenuProps={{
          disablePortal,
          classes: {
            root: "select-menu-container",
            paper: "select-menu",
            list: "select-menu-list",
          },
        }}
        renderValue={
          cropItems && multiple
            ? value => {
              const val =
                  options.find(
                  	item => item.value === value[0] || item === value[0]
                  )?.name || value[0];
              return (
                <>
                  {(value as any[])?.length > 1 ? (
                    <>
                      {val}
                      <Chip
                        label={`+${(value as any[]).length - 1}`}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          height: 18,
                          ml: 0.8,
                          fontSize: 11,
                          ".MuiChip-label": {
                            py: 0,
                            px: 0.75,
                          },
                        }}
                      />
                    </>
                  ) : (
                    val
                  )}
                </>
              );
            }
            : undefined
        }
      >
        {placeholder &&
          (native ? (
          	<option key={"placeholder"} value="" disabled>
          		{placeholder}
          	</option>
          ) : (
          	<StyledMenuItem
          		key={"placeholder"}
          		value=""
          		disabled
          		className={size}
          	>
          		{placeholder}
          	</StyledMenuItem>
          ))}
        {options &&
          !!options.length &&
          options.map(item =>
          	native ? (
          		<option value={item.value} key={item.name}>
          			{item.name}
          		</option>
          	) : (
          		<StyledMenuItem
          			value={item.value}
          			key={item.name}
          			className={size}
          		>
          			{item.name} {item.tag != null ? `(${item.tag})` : ""}
          		</StyledMenuItem>
          	)
          )}
      </StyledSelect>
    </React.Fragment>
  );
};
