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

import styled from "@emotion/styled";
import { darken } from "polished";

export const TabsContainer = styled.div`
  display: flex;
  background: ${({ theme }: any) => theme.palette.backgroundColor.main};
  /* box-shadow: ${({ theme }: any) => theme.customShadows[2]}; */
  border: 1px solid ${({ theme }: any) => theme.palette.borderColor.main};
  border-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
`;

export const TabContainer = styled.div`
  font-size: 14px;
  color: #3c3c3c;
  &:first-of-type .item-tab {
    border-top-left-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
    border-bottom-left-radius: ${({ theme }: any) =>
    theme.shape.borderRadius}px;
  }
  a {
    cursor: pointer;
  }
  .item-tab {
    display: block;
    padding: 10px 15px;
    &:hover:not(.active) {
      background: ${({ theme }: any) =>
    darken(0.02, theme.palette.backgroundColor.main)};
    }
  }
  .active {
    background: ${({ theme }: any) => theme.palette.backgroundColor.header};
    color: #ffffff;
  }
`;
