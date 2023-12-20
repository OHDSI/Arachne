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

import { InputBase, InputBaseProps, Theme, styled } from "@mui/material";
import { darken, position } from "polished";

export const StyledInput = styled(InputBase, {
  shouldForwardProp: prop =>
    prop != "active" && prop != "color" && prop !== "size",
})<{ active: boolean; color?: string; size: "small" | "medium" | "large" }>(
  ({ active, theme, size, color }: any) => ({
    "&.input-root": {
      input: {
        lineHeight: { small: "20px", medium: "24px", large: "28px" }[size],
        color: color || theme.palette.textColor.secondary,
        textOverflow: "ellipsis",
      },
      textarea: {
        color: color || theme.palette.textColor.secondary,
        lineHeight: { small: "20px", medium: "24px", large: "28px" }[size],
      },
      ".select-root, input, textarea": {
        padding: "0",
      },
      ".select-icon": {
        right: 0,
      },
      ...(active
        ? {
          border: "1px solid " + theme.palette.secondary.main,
          "&:hover": {
            border: "1px solid " + darken(0.1, theme.palette.secondary.main),
          },
        }
        : {
          border: "1px solid transparent",
          "&:not(.Mui-disabled):hover": {
            backgroundColor: theme.palette.backgroundColor?.dark,
          },
        }),
      "&.Mui-disabled, &.Mui-disabled input": {
        color: color || theme.palette.textColor.secondary,
        WebkitTextFillColor: "unset",
      },
      ".end-adornment": {
        visibility: active ? "visible" : "hidden",
        ".MuiButtonBase-root": {
          color: darken(0.2, theme.palette.secondary.main),
        },
      },
      "&:not(.Mui-disabled):hover .end-adornment": {
        visibility: "visible",
      },

      transition: "background-color 300ms",
      fontSize: { small: 14, medium: 20, large: 24 }[size],
      lineHeight: { small: "20px", medium: "24px", large: "28px" }[size],
      fontWeight: { small: 400, medium: 300, large: 300 }[size],
      borderRadius: "4px",
      padding: "4px 8px",
      // width: '100%',
      boxSizing: "border-box",
      height: "auto",
    },
  })
);
