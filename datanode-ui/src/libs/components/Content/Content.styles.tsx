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

export const Content = styled.div`
  padding: 16px;
`;

export const FormElementContainer: any = styled.div`
  font-size: 13px;
  label {
    color: ${({ theme }: any) => theme.palette?.textColor.header};
    font-weight: 700;
    display: ${({ inline }: any) => (inline ? "inline-block" : "block")};
    /* font-size: 12px; */
    margin-bottom: 5px;
  }
  .required {
    color: ${({ theme }: any) => theme.palette?.error.main};
  }
  p {
    margin: 0;
    margin-top: 2px;
    font-size: 12px;
    color: ${({ theme }: any) => theme.palette?.textColor.secondary};
  }
  color: ${({ theme }: any) => theme.palette?.textColor.secondary};
`;

export const FormActionsContainer = styled.div`
  text-align: right;
  button:last-child {
    margin-left: 10px;
  }
`;

export const BaseFormUpdateTitle = styled.div`
  margin-bottom: 10px;
  h5 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #626262;
  }
`;
