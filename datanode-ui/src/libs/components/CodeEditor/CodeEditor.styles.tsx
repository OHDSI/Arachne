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
import { setLightness } from "polished";

export const CodeEditorContainer = styled.div`
  /* padding: 20px; */
`;

export const CodeEditorTitle = styled.div`
  background-color: #d8e1ef;
  color: #343434;
  margin-right: -2px;
  padding: 8px 12px;
  justify-content: space-between;
`;

export const CodeEditorContentContainer = styled.div`
  position: relative;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-end;

  .monaco-editor {
    border: 1px solid #d8e1ef;
    /* border-top: none; */

    .line-numbers,
    .active-line-number {
      color: ${({ theme }: any) => theme.palette?.primary.main};
    }
    .margin {
      .current-line {
        background-color: ${({ theme }: any) =>
    setLightness(0.9, theme.palette?.primary.main || "#000000")};
      }
    }
    .margin {
      background-color: #e6ecf5;
    }
  }
`;

export const CodeEditorActionsContainer = styled.div`
  display: flex;
  padding-bottom: 10px;
  position: absolute;
  right: 16px;
  top: 2px;
  z-index: 4;
`;
