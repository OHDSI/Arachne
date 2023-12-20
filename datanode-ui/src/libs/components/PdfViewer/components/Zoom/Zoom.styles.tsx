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
import { transparentize } from "polished";

export const ZoomContainer = styled.div`
  //background: .;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: 40px;
  padding: 0 4px;
`;

export const ZoomContent = styled.div`
  padding: 6px 0;
`;

export const IconContainer = styled.div<any>`
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  :not(:last-of-type) {
    margin-right: 5px;
  }
  &:hover {
    opacity: 1;
    background-color: ${(props: any) =>
    transparentize(0.9, props.theme.palette?.secondary.main)};
  }
  ${({ disabled, theme }) =>
    disabled &&
    `
    .icon {
      color: ${theme.palette?.grey[400]}
    }
    &:hover {
      cursor: default;
      background-color: transparent;
    }
  `}
`;
