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

import { Spinner, SpinnerWidgetContainer } from "../Spinner";
import React from "react";
import { FileViewer } from "../FileViewer";
import {
  DowloadLink,
  HeaderFileReader,
  HeaderTitle,
} from "./FileExplorer.styles";
import { FileList } from "./FileList";
import { NoDataContainer } from "../FileViewer/FileViewer.styles";
import { Grid } from "../Grid";
import { Status } from "../../enums";
import { useFileExplorer } from "../../hooks/useFileExplorer";
import { Paper } from "@mui/material";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

export interface FileExplorerPropsInterface {
  submissionId: number | string;
  url: string;
  noDataMessage?: string;
}

export const FileExplorer: React.FC<FileExplorerPropsInterface> = props => {
  const { submissionId, url, noDataMessage = "Results are empty" } = props;

  const { fileTree, status, selectedFile, filesContent, selectFile } =
    useFileExplorer(submissionId, url);

  if ([Status.INITIAL, Status.IN_PROGRESS].includes(status)) {
    return (
      <Grid item xs={12} py={"100px"}>
        <SpinnerWidgetContainer>
          <Spinner size={30} />
        </SpinnerWidgetContainer>
      </Grid>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      {fileTree?.__size__ === 0 ? (
        <Grid item xs={12}>
          <NoDataContainer>{noDataMessage}</NoDataContainer>
        </Grid>
      ) : (
        <Grid container border="1px solid" borderColor="borderColor.main">
          <Grid item xs={12}>
            <HeaderFileReader>
              <Grid container>
                <Grid
                  item
                  xs={3}
                  style={{
                    paddingRight: "21px",
                    borderRight: "1px solid",
                  }}
                >
                  <HeaderTitle>File Explorer</HeaderTitle>
                  {fileTree?.__size__ > 0 && (
                    <DowloadLink>
                      <a
                        href={`/api/v1/${url}/${submissionId}/results`}
                        target="_blank" rel="noreferrer"
                      >
                        <Button
                          variant="outlined"
                          size="xsmall"
                          name="download-all-result-files"
                          startIcon={<Icon iconName="import" />}
                        >
                          Download All
                        </Button>
                      </a>
                    </DowloadLink>
                  )}
                </Grid>
                <Grid item xs={9}>
                  {selectedFile && (
                    <>
                      <HeaderTitle marginLeft="20px">
                        {selectedFile.__name__}
                      </HeaderTitle>
                      <DowloadLink>
                        <a
                          href={`/api/v1/${url}/${submissionId}/results/list/${selectedFile?.path}`}
                          target="_blank" rel="noreferrer"
                        >
                          <Button
                            variant="outlined"
                            size="xsmall"
                            startIcon={<Icon iconName="import" />}
                          >
                            Download
                          </Button>
                        </a>
                      </DowloadLink>
                    </>
                  )}
                </Grid>
              </Grid>
            </HeaderFileReader>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={3}
                borderRight="1px solid"
                borderColor="borderColor.main"
                style={{ height: "80vh", overflowY: "auto" }}
              >
                <FileList
                  fileTree={fileTree}
                  // files={files}
                  // filesList={files}
                  status={status}
                  selectedFile={selectedFile}
                  selectFile={selectFile}
                />
              </Grid>
              <Grid item xs={9} sx={{ height: "calc(100vh - 250px)" }}>
                <FileViewer
                  fileContent={filesContent?.[selectedFile.path]}
                  fileMetadata={selectedFile}
                  status={status}
                  pdfLink={`/api/${url}/${submissionId}/results/${selectedFile?.path}/download`}
                  height={"calc(100vh - 250px)"}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};
