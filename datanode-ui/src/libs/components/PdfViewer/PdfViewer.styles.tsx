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

export const PdfViewerContainer = styled.div<any>`
  height: 100%;
  overflow: ${props => (props.scroll ? "auto" : "hidden")};
  display: flex;
  flex-direction: column;
  position: relative;

  .react-pdf__Document {
    // max-height: ${props => `${props.height}px`};
    /* height: calc(100% - 80px);
    overflow: auto; */
  }
  .react-pdf__Page {
    margin: 10px 0;
  }
  .react-pdf__Page__textContent {
    border: 1px solid darkgrey;
    box-shadow: 5px 5px 5px 1px #ccc;
    border-radius: 5px;
  }

  .react-pdf__Page__canvas {
    margin: 0 auto;
  }
`;
