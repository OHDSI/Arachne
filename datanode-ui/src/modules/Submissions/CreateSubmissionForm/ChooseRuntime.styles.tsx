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

export const ChooseItemContainer = styled.div<any>`
  font-size: 12px;
  font-weight: 300;
  padding: 5px 5px;
  border-bottom: 1px solid #232323;
  margin: 0px 10px 0px 0px;
  cursor: pointer;

  &.active {
    font-weight: 700;
  }
  &:hover {
    background: #e1e1e1;
  }
`;

export const CurrentRuntimeContainer = styled.div<any>`
  height: 500px;
  overflow-y: auto;
`;

export const SpinnerFormContainer = styled.div`
  position: absolute;
  width: 700px;
  height: calc(100vh - 60px);
  top: 0;
  right: 0;
  background: #eff8fd96;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  z-index: 1000;
`;
