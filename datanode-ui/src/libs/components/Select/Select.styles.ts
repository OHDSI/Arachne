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

import Select from "@mui/material/Select";
import { css } from "@emotion/react";
import { getColor } from "../common/utils";
import { MenuItem, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";

export const menuStyles = (theme: Theme) => css`
  .select-menu-container {
    .select-menu {
      border-radius: ${theme.shape?.borderRadius || 0}px;
      .select-menu-list {
        padding: 0;
      }
    }
  }
`;

export const StyledSelect = styled(Select)`
  height: 30px;
  background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.light || "#fff"};
  border-radius: ${({ theme }: { theme: Theme }) =>
    theme.shape?.borderRadius || 0}px;
  font-size: ${(props: any) => props.native && "0.9rem"};
  /* &.select-root { */
  padding: 0;
  font-size: 13px;
  color: ${({ theme }: { theme: Theme }) => theme.palette?.grey[1000]};
  .select-base {
    padding-left: 10px;
    padding-top: 0;
    padding-bottom: 0;
  }
  /* } */
  &.button-group-disabled {
    .select-icon {
      color: ${({ theme }: { theme: Theme }) => theme.palette?.grey[300]};
    }
  }
  .select-icon {
    color: ${({ theme }: { theme: Theme }) => getColor(theme)()};
  }
  .select-notched-outline {
    border-color: ${({ theme }: any) =>
    theme.palette?.borderColor.main};
  }
  :hover:not(.button-group-disabled),
  &.select-focused {
    fieldset,
    .select-notched-outline {
      border-width: 1px;
      border-color: ${({ theme }: any) =>
    theme.palette?.borderColor.main} !important;
    }
  }
  &.select-small {
    height: 24px;
    font-size: 12px;
    line-height: 22px;
    .select-icon {
      right: 1px;
    }
  }
`;

export const StyledMenuItem: any = styled(MenuItem)`
  padding-top: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(1) : "12px"};
  padding-bottom: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(1) : "12px"};
  padding-left: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(1.5) : "15px"};
  font-size: ${({ theme }: any) => theme.typography.fontSize};
  font-weight: ${({ theme }: any) => theme.typography?.fontWeightMedium || 300};
  color: ${({ theme }: any) =>
    (theme.palette && theme.palette.grey[900]) || "black"};
  &.medium {
    padding-top: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(0.8) : "8px"};
    padding-bottom: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(0.8) : "8px"};
    padding-left: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(1) : "12px"};
    font-size: 0.85em;
  }
  &.small {
    padding-top: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(0.5) : "5px"};
    padding-bottom: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(0.5) : "5px"};
    padding-left: ${({ theme }: any) =>
    theme.spacing ? theme.spacing(1) : "12px"};
    font-size: 0.8em;
  }
`;

export const typography: any = (theme: Theme) => ({
  paddingTop: theme.spacing ? theme.spacing(1) : "12px",
  paddingBottom: theme.spacing ? theme.spacing(1) : "12px",
  paddingLeft: theme.spacing ? theme.spacing(1.5) : "15px",
  fontSize: theme.typography.fontSize,
  fontWeight: theme.typography?.fontWeightMedium || 300,
  color: (theme.palette && theme.palette.grey[900]) || "black",
});
