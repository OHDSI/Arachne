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

import styled, { StyledComponent } from "@emotion/styled";
import { Avatar } from "@mui/material";

export const CurrentUser: StyledComponent<any> = styled.div`
  color: #fff;
  font-size: 14px;
`;

export const AccountName: StyledComponent<any> = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
`;

export const LogoutIcon: StyledComponent<any> = styled.div`
  line-height: 14px;

  svg {
    padding: 0 12px 0 24px;
    cursor: pointer;
    font-size: 18px;
  }
`;

export const AccountAction: StyledComponent<any> = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const UserAvatar: StyledComponent<any> = styled(Avatar)`
  width: 30px;
  height: 30px;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 16px;
  & {
    color: ${({ theme }: any) => theme.palette.primary.main};
  }
  background-color: ${({ theme }: any) => theme.palette.secondary.main};
`;
