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

export const BlockBaseContainer: any = styled("div")`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme, isDark }: any) => {
    return isDark ? theme.palette.backgroundColor.dark + "d4" : "#fff";
  }};
  border-radius: ${(props: any) => props.theme.shape?.borderRadius || 0}px;
  box-shadow: ${({ theme, elevated }: any) =>
    elevated ? theme.customShadows[2] : "none"};
  /* border: 1px solid #c2cad2; */
  flex: 1;
  max-width: 100%;
  box-sizing: border-box;
  min-height: ${(props: any) =>
    typeof props?.minHeight === "string"
      ? props?.minHeight
      : props?.minHeight + "px"};
  // max-height: ${(props: any) => props?.minHeight}px;
`;

export const BlockBaseBodyContent: any = styled<any>("div")`
  background-color: ${({ theme, isDark }: any) => {
    return isDark ? theme.palette.backgroundColor.dark + "d4" : "#fff";
  }};
  border-radius: 5px;
  padding: 16px;
  /* &.plain-block {
    padding: 0;
  } */
`;

export const BlockBaseSectionTitle = styled("div", {
  shouldForwardProp: prop => prop !== "unstyled",
})<{ unstyled?: boolean }>`
  white-space: nowrap;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  max-width: calc(100% - 28px);
  .collapsible-content-block__title-text {
    flex-grow: 1;
  }
  &:hover div:not(button) {
    text-decoration: ${({ unstyled }) => (unstyled ? "none" : "underline")};
  }
  font-weight: 600;
`;

export const Content = styled("div")`
  /* padding: 24px; */
`;
