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

import styled, { StyledComponent } from "@emotion/styled";
import { lighten, setLightness } from "polished";

export const StatusItem: StyledComponent<any> = styled.div<any>`
  display: inline-block;
  padding: 2px 4px;
  height: 16px;
  min-width: 64px;
  text-align: center;
  border-radius: 2px;
  background-color: ${({ color, theme, light }: any) => {
    const COLOR =
      theme.palette?.[color]?.main || color || theme.palette?.grey[700];

    return light ? setLightness(0.9, COLOR) : COLOR;
  }};
  color: ${({ color, theme, light }: any) => {
    const COLOR =
      theme.palette?.[color]?.main || color || theme.palette?.grey[700];
    return light ? COLOR : "#ffffff !important";
  }};
  font-size: 12px;
  font-weight: ${({ light }) => (light ? 600 : 400)};
  line-height: 16px;
  font-weight: 600;
  min-width: 90px;
  cursor: default;

  span {
    display: inline-block;
    margin-right: 3px;
  }
`;
