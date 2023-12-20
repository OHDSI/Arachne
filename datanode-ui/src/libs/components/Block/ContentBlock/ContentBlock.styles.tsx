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

import { styled } from "@mui/material/styles";

export const BlockBaseHeadContent = styled("div")`
  display: flex;
  align-items: center;
  cursor: pointer;
  /* background-color: ${({ theme }: any) =>
    theme.palette?.backgroundColor.main}; */
  padding: 0 16px;
  height: 50px;
  color: ${({ theme }: any) => theme.palette?.textColor.header};

  border-radius: ${({ theme }: any) => theme.shape.borderRadius}px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .collapsible-content-block__title-text {
    font-size: 16px;
    font-weight: 500;
  }
  &.content-visible::after {
    content: '';
    display: block;
    left: 16px;
    bottom: 0;
    position: absolute;
    width: calc(100% - 32px);
    border-bottom: 1px solid
      ${({ theme }: any) => theme.palette?.borderColor.main + 80};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;
