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

import { Radio, RadioProps, styled, Theme } from "@mui/material";
import { getColor } from "../common/utils";

import { StyledComponent } from "@emotion/styled";

export const StyledRadio: StyledComponent<RadioProps> = styled(Radio)`
  padding: 0;
  &.radio {
    &-checked {
      color: ${({ theme, color }: any) => getColor(theme)(0.6, color)};
    }
    &-disabled {
      color: ${({ theme }: { theme: Theme }) =>
    theme.palette?.action.disabledBackground || "lightgrey"};
    }
  }
`;
