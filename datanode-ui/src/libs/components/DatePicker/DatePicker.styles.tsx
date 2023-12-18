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

import { TextField, styled, Theme } from "@mui/material";
import { getColor } from "../common/utils";

export const StyledField: any = styled(TextField, {
  shouldForwardProp: prop => prop !== "size",
}) <{
  size?: "small" | "medium" | "large";
}>`
  .datepicker {
    svg {
      font-size: 16px;
    }
    &-input-root {
      padding: ${({ size }) => (size == "small" ? "4px 6px" : "4px 10px")};
      border-radius: ${({ theme }: any) =>
    theme.shape?.borderRadius || 0}px;
      background-color: #ffffff;
      &:not([class*='Mui-focused']):hover
        [class*='MuiOutlinedInput-notchedOutline'] {
        border-color: ${({ theme }: any) => getColor(theme)(0.7)};
      }
      .datepicker-notched-outline {
        border-color: ${({ theme }: any) =>
    theme.palette?.borderColor.main};
      }
    }
    &-input {
      padding: 0;
      height: ${({ size }: any) =>
    size == "small" ? "16px" : "20px"};
      font-size: ${({ size }: any) =>
    size == "small" ? "12px" : "14px"};
    }
    &-adornment {
      width: 30px;
      height: ${({ size }: any) =>
    size == "small" ? "18px" : "22px"};
      margin-left: 0;
    }
    &-focused,
    &-error {
      fieldset.datepicker-notched-outline {
        border-width: 1px;
      }
    }
    &-focused {
      fieldset.datepicker-notched-outline {
        border-color: ${({ theme }: { theme: Theme }) =>
    theme.palette?.primary.main || "lightgrey"};
      }
    }
    &-error {
      fieldset.datepicker-notched-outline {
        border-color: ${({ theme }: { theme: Theme }) =>
    theme.palette?.error.main || "red"};
      }
    }
    &-button {
      padding: 8px;
    }
    &-button-icon {
      svg {
        color: ${({ theme }: { theme: Theme }) => getColor(theme)(0.5)};
      }
    }
  }
`;
