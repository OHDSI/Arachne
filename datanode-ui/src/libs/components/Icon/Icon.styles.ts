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

import { StyledComponent } from "@emotion/styled";
import { Theme, styled } from "@mui/material";
import { IconProps } from "./Icon";

export const IconContainer: StyledComponent<any> = styled("div")`
  width: ${({ size }: any) => size || 24}px;
  height: ${({ size }: any) => size || 24}px;
  display: flex;
  opacity: 0.8;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0;
  justify-content: center;
  color: ${({ color, theme }: { theme: Theme } & IconProps) =>
    color || theme.palette?.primary.main || "grey"};
  .icon {
    display: inline-block;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
`;
