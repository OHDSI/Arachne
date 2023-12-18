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
import { Spinner } from "./Spinner";

export const InlineSpinner: any = styled(Spinner)`
  align-self: center;
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  width: calc(100vw - 70px);
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

export const SpinnerFullContainer = styled.div`
  position: absolute;
  width: calc(100vw);
  height: calc(100vh);
  top: 0;
  right: 0;
  background: #eff8fd96;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  z-index: 1000;
`;

export const SpinnerWidgetContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;