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

export const HeaderChip: any = styled.div`
  font-size: 10px;
  display: inline-block;
  margin-left: 8px;
  background: #ffffff;
  padding: 5px 7px;
  color: ${({ theme }: any) => theme.palette?.primary.main};
`;

export const SubmissionHeader = styled("div")(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  fontSize: 24,
  fontWeight: 300,
  paddingBottom: 0,
}));

export const SubmissionHeaderItem = styled.div<any>`
  font-size: ${props => (props.smallFont ? "12px" : "24px")};
  /* margin-left: 10px; */
`;
