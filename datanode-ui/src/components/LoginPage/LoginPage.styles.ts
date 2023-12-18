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
import { Grid } from "../../libs/components";

export const LogoContainer: StyledComponent<any> = styled(Grid)(
  (props: any) => ({
    backgroundColor: props.theme.palette.textColor.primary,
    boxShadow: props.theme.customShadows[0],
    zIndex: 1,
  })
);

export const LoginFormContainer: StyledComponent<any> = styled(Grid)(
  (props: any) => ({
    backgroundColor: props.theme.palette.backgroundColor.dark,
    alignItems: "center",
    position: "relative"
    // display: 'fex',
    // fontFamily: 'R',
  })
);

export const WelcomeText: StyledComponent<any> = styled(Grid)`
  font-size: 14px;
  color: #aaaaaa;
`;

export const LoginFormHeader: StyledComponent<any> = styled(Grid)`
  font-size: 24px;
  color: #424242;
  font-weight: 300;
`;

export const FormControl: StyledComponent<any> = styled(Grid)`
  label {
    color: ${({ theme }: any) => theme.palette.primary.main};
    font-weight: 700;
    width: 130px;
    display: block;
    font-size: 12px;
    margin-bottom: 5px;
  }
`;

export const Divider: StyledComponent<any> = styled.div`
  display: block;
  border-top: 1px solid ${({ theme }: any) => theme.palette?.borderColor.main};
  margin-bottom: 16px;
`;

export const LogInText = styled.span`
display: inline-block;
margin-right:10px;
`;

export const WrapperAlert = styled.div`
position: absolute;
width:100%;

`;
