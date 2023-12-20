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

import { styled, Theme } from "@mui/material/styles";
// import { Theme } from '../../';

export const BlockTitleStartIcon = styled("div")`
  /* opacity: 0.4; */
  display: inline-block;
  margin-right: 8px;
  margin-top: 4px;
`;
export const BlockTitleText = styled("div")`
  font-weight: 600;
  font-size: 16px;
`;

export const BlockTitleContainer = styled("div")`
  height: 42px;
  min-height: 42px;
  /* background-color: ${({ theme }: any) => theme.palette.backgroundColor.main}; */
  color: ${({ theme }: any) => theme.palette.primary.main};
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid #d0d7de;
  border-top-left-radius: ${(props: any) =>
    props.theme.shape?.borderRadius || 0}px;
  border-top-right-radius: ${(props: any) =>
    props.theme.shape?.borderRadius || 0}px;

  /* button,
  svg {
    color: #fff;
  } */
`;
