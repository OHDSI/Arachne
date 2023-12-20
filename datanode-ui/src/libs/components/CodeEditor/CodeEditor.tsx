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

import React, {
  FC,
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
} from "react";


import Editor from "@monaco-editor/react";

import {
  CodeEditorContainer,
  CodeEditorTitle,
  CodeEditorContentContainer,
  CodeEditorActionsContainer,
} from "./CodeEditor.styles";
import { FileContentType } from "./CodeEditor.constants";

import { getCodeEditorOptions } from "./CodeEditor.utils";
import type { ICodeEditorProps } from "./CodeEditor.types";
import { FileExtension } from "../../enums/FileExtension";
import { IconButton } from "@mui/material";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";
import { downloadFile } from "../../utils/downloadFile";
import { debounce, isObject, isString } from "lodash";

function isJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
}

export const CodeEditor: FC<ICodeEditorProps> = memo(props => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [line, setLine] = useState(100000);
  const {
    title = "",
    tooltipText = "Copied to clipboard!",
    fileName = "File",
    fileExtension = FileExtension.JSON,
    contentType = FileContentType.APPLICATION_JSON,
    editorOptions = {},
    data,
    language = "plaintext",
    height = "500px",
    containerStyles = {},
    readOnly = false,
    consoleMode = false,
    enableValidation = true,
    enableCopy = true,
    enableDownload = true,
    onChange,
    remoteFile = false,
    downloadMethod,
  } = props;

  const opts = useMemo(
    () =>
      getCodeEditorOptions(
        { ...editorOptions, readOnly, copyWithSyntaxHighlighting: true },
        enableValidation
      ),
    [editorOptions, enableValidation, readOnly]
  );
  const [file, setFile] = useState<any>("");
  const hasActionButtons = enableCopy || enableDownload;

  const handleCopy = useCallback(() => {
    setIsTooltipVisible(true);
    navigator.clipboard.writeText(file);
    debounce(() => setIsTooltipVisible(false), 2000)();
  }, [file]);

  const handleDownload = useCallback(() => {
    downloadFile(file, `${fileName}.${fileExtension}`, contentType);
  }, [data, fileName, fileExtension, contentType, file]);

  const handleChange = useCallback((value?: string) => {
    onChange?.(value);
  }, []);

  //@TODO: remove this call when the documents module will be changed.
  useEffect(() => {
    if (!remoteFile) {
      if (language === "json") {
        const isStringData = data && isString(data);

        if (isStringData) {
          const isJsonData = isJson(data);

          setFile(isJsonData ? JSON.stringify(isJsonData, null, 2) : data);
        } else {
          const preparedData = isObject(data)
            ? JSON.stringify(data, null, 2)
            : data;
          setFile(preparedData);
        }
      } else {
        setFile(data);
      }
      return;
    }

    async function fetchData() {
      const dataFile = await downloadMethod(
        isObject(data) ? data?.["id"] : data
      );
      const preparedData = isObject(dataFile)
        ? JSON.stringify(dataFile, null, 2)
        : dataFile;
      setFile(preparedData);
    }
    fetchData?.();
  }, [data]);


  useEffect(() => {
    if (consoleMode) {
      setLine(preState => preState + 1000);
    }
  }, [file]);

  return (
    <CodeEditorContainer style={containerStyles}>
      {title && <CodeEditorTitle title={title}>{title}</CodeEditorTitle>}
      <CodeEditorContentContainer>
        {hasActionButtons && (
          <CodeEditorActionsContainer className="actions-container">
            {enableCopy && (
              <IconButton
                onClick={handleCopy}
                className="actions-container__button-copy"
                name="copyToClipboard"
              >
                <Tooltip
                  text={tooltipText}
                  controlled
                  show={isTooltipVisible}
                  width={130}
                >
                  <Icon
                    iconName="copy"
                    sx={{ fontSize: 18 }}
                    name="Copy to clipboard"
                  />
                </Tooltip>
              </IconButton>
            )}
            {enableDownload && (
              <IconButton
                onClick={handleDownload}
                className="actions-container__button-download"
                name="downloadFile"
              >
                <Icon
                  iconName="download"
                  sx={{ fontSize: 18 }}
                  name="Download as file"
                />
              </IconButton>
            )}
          </CodeEditorActionsContainer>
        )}
        <Editor
          height={height}
          language={language}
          // value={
          //   language === 'json' && file && isObject(file)
          //     ? JSON.stringify(file, null, 2)
          //     : file
          // }
          value={file}
          line={line}
          options={opts as any}
          onChange={handleChange}
        />
      </CodeEditorContentContainer>
    </CodeEditorContainer>
  );
});
