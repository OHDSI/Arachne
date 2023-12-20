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

import React from "react";
import { FileListContainer } from "./FileExplorer.styles";
import { FileItem } from "./FileItem";
import { Grid } from "../Grid";
import { Typography } from "@mui/material";

export const FileList: React.FC<any> = props => {
  const { selectedFile, selectFile, status, subList, fileTree } = props;
  const data = fileTree?.__size__ > 0 ? Object.values(fileTree) : [];
  data.sort((a: any, b: any) => {
    if (a.__type__ < b.__type__) return 1;
    if (a.__type__ > b.__type__) return -1;
    return 0;
  });

  return (
    <FileListContainer subList={subList}>
      <Grid container>
        {data?.length > 0 ? (
          data.map((item, index) => {
            return (
              <Grid item xs={12} key={index}>
                <FileItem
                  subList={subList}
                  files={fileTree}
                  selectedFile={selectedFile}
                  selectFile={selectFile}
                  item={item}
                  status={status}
                />
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography py={3} variant="h2" align="center">
              No files to display
            </Typography>
          </Grid>
        )}
      </Grid>
    </FileListContainer>
  );
};
