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

export const StyledTableCell: any = styled.td`
  padding: 8px;
  /* text-align: left; */
  font-weight: 400;
  font-size: 0.875rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  box-sizing: border-box;
  ${({ maxWidth, isCropped }: any) =>
    isCropped && maxWidth ? `max-width: ${maxWidth}px;` : "max-width: auto;"};
  ${({ minWidth }: any) => (minWidth ? `min-width: ${minWidth}px;` : "")}
  &:first-of-type {
    padding-left: 16px;
  }
  &:last-of-type {
    padding-right: 16px;
  }
`;
