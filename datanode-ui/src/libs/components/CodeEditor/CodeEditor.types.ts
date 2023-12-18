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

import { FileExtension } from "../../enums/FileExtension";
import { FileContentType } from "./CodeEditor.constants";
import { EditorProps } from "@monaco-editor/react";

export interface ICodeEditorProps extends EditorProps {
  title?: string;
  tooltipText?: string;
  fileName?: string;
  fileExtension?: FileExtension;
  contentType?: FileContentType;
  data: any;
  language?: string;
  height?: string | number;
  editorOptions?: Record<string, any>;
  containerStyles?: Record<string, string | number>;
  readOnly?: boolean;
  onChange?: (value?: string) => void;
  enableValidation?: boolean;
  enableDownload?: boolean;
  enableCopy?: boolean;
  remoteFile?: boolean;
  downloadMethod?: (document: any) => void;
  consoleMode?: boolean;
}
