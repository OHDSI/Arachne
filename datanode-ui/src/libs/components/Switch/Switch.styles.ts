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

import { SwitchProps } from "./Switch";
import { Switch, styled } from "@mui/material";
import { lighten, transparentize } from "polished";

export const StyledSwitch = styled(Switch)`
  width: ${({ size }: any) => (size === "small" ? 30 : 44)}px;
  height: ${({ size }: any) => (size === "small" ? 16 : 24)}px;
  padding: 0;
  .switch {
    &-base {
      padding: 2px;
      color: ${({ theme, color }: any) => theme.palette[color].main};
      opacity: 1;
      &.switch-checked {
        transform: translateX(14px);
        & + .switch-track {
          background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.main || "grey"};
          color: ${({ theme, color }: any) => theme.palette.primary.main};
        }
      }
    }
    &-thumb {
      width: ${({ size }: any) => (size === "small" ? 12 : 22)}px;
      height: ${({ size }: any) => (size === "small" ? 12 : 22)}px;
      box-shadow: none;
    }
    &-track {
      height: calc(100% - 2px);
      border-radius: 13px;
      background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.main || "grey"};
      border: 1px solid
        ${({ theme }: any) =>
    transparentize(0.2, theme.palette.borderColor.main)};
      opacity: 1;
    }
    &-small {
    }
  }
  &.square {
    .switch {
      &-base {
        padding: 2px;
      }
      &-track {
        border-radius: 3px;
      }
      &-thumb {
        width: ${({ size }: SwitchProps) => (size == "small" ? 16 : 22)}px;
        height: ${({ size }: SwitchProps) => (size == "small" ? 16 : 22)}px;
        border-radius: 2px;
        box-shadow: none;
      }
    }
  }
`;
