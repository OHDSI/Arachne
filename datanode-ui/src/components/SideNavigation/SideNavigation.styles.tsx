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
import { Button } from "../../libs/components";
import { NavLink } from "react-router-dom";

export const NavigationContainer = styled.div`
  padding: 0 18px;
  width: 70px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${({ theme }: any) => theme.shadows[2]};
  background-color: #ffffff;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  /* background: ${(props: any) => {
    return props.theme.palette?.backgroundColor.default || "#ffffff";
  }}; */
`;

export const StyledButton: any = styled(Button)`
  justify-content: space-around;
  align-items: center;
  padding: 6px;
  min-width: auto;
  margin: 8px 0;
  border-radius: 2px;
  .MuiSvgIcon-root {
    font-size: 28px;
  }
`;

export const LogoContainer = styled(NavLink)`
  padding: 12px 0px 16px;
`;

export const InfoContainer = styled.div`
  font-size: 9px;
  color: ${({ theme }: any) => theme.palette?.primary.main};
  padding: 5px 10px;
  position: absolute;
  bottom: 0;
`;
