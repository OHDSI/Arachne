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
import { darken, transparentize } from "polished";


export const StatusHeader = styled.div`
  font-size: 70px;
  font-weight: 800;
  color: ${({ theme }: any) =>
    darken(0.1, theme.palette?.backgroundColor?.main || "#F7F8FA")};
  margin-right: 8px;
`;

export const StatusDescription = styled.div`
  font-size: 28px;
  font-weight: 800;
  /* margin-bottom: 50px; */
  color: ${({ theme }: any) => {
    return transparentize(0.1, theme.palette?.textColor?.label || "#798395");
  }};
`;

export const MessageErrorPage = styled.div`
  font-size: 20px;
  padding: 0 40px;
  /* margin-bottom: 16px; */
  color: ${({ theme }: any) =>
    theme.palette?.textColor?.label || "#798395"};
`;
