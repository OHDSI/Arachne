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
import { transparentize } from "polished";
import { BlockBase, BlockBaseSectionTitle } from "../BlockBase";
import { BlockBaseHeadContent } from "../ContentBlock/ContentBlock.styles";

export const CollapsiblePanelBlock = styled(BlockBase)`
  /* border: 1px solid
    ${(props: any) => props.theme.palette?.borderColor.main || "#e4e4e4"}; */
`;
export const CollapsiblePanelHeadContent = styled(BlockBaseHeadContent)`
  background-color: ${({ theme }: any) =>
    transparentize(0.3, theme.palette?.secondary.main)};
  justify-content: space-between;
`;

export const CollapsiblePanelSectionTitle = styled(BlockBaseSectionTitle)`
  &:hover {
    text-decoration: none;
  }
`;

export const CollapseIconArrow = styled("div")`
  border: solid #8e97a7;
  border-width: 0 2px 2px 0;
  display: inline-block;
  top: 2px;
  right: 4px;
  height: 8px;
  min-width: 8px;
  position: relative;
  transform: rotate(-135deg);

  &.down {
    top: -2px;
    transform: rotate(45deg);
  }
  &.right {
    transform: rotate(-45deg);
    left: -2px;
  }
  &.left {
    transform: rotate(135deg);
    left: 2px;
  }
`;
