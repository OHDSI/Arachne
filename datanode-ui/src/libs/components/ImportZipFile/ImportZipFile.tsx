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

import React, { FC, useState } from "react";

import { useTheme } from "@emotion/react";
import JSZip from "jszip";
import { useNotifications } from "../Notification";
import { Grid } from "../Grid";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { IconButton, Typography } from "@mui/material";

export const ImportZipFile: FC<any> = props => {
  const { onChange, titleButton = "Upload file" } = props;
  const { enqueueSnackbar } = useNotifications();
  const [currentFile, setCurrentFile] = useState(null);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        p={1.5}
        border="2px dashed"
        borderColor="borderColor.main"
        container
        alignItems="center"
        flexWrap="nowrap"
      >
        <Grid item>
          <Button
            variant="contained"
            // @ts-ignore
            component="label"
            color="info"
            size="small"
            startIcon={<Icon iconName="upload" />}
            sx={{ minWidth: 150 }}
          >
            {titleButton}
            <input
              type="file"
              accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
              onChange={async e => {
                const archive = e.target.files[0];
                let json = null;
                const zip = new JSZip();
                zip.loadAsync(archive).then(async files_zip => {
                  const fileMetadata = Object.values(files_zip.files).find(elem => (elem.name.indexOf('metadata.json') >= 0 || elem.name.indexOf('execution-config.json') >= 0) && !(elem.name.indexOf('_') === 0))
                  
                  if(fileMetadata) {
                    const res = await zip.file(fileMetadata.name).async("string");
                    json = JSON.parse(res)
                  }
                  setCurrentFile(archive);
                  onChange(files_zip, archive, json);
                });
                // readFile(file);
              }}
              hidden
            />
          </Button>{" "}
        </Grid>
        <Grid item flexGrow={1} ml={2} display="flex" alignItems="center">
          {currentFile ? (
            <>
              <Typography
                sx={{ maxWidth: "calc(100% - 30px)", wordBreak: "break-all" }}
              >
                {currentFile?.name}
              </Typography>
              {/* if you don't need button just comment this */}
              <IconButton
                size="small"
                color="error"
                sx={{ p: 0.5, ml: 1 }}
                onClick={() => {
                  setCurrentFile(undefined);
                  onChange(undefined);
                }}
              >
                <Icon iconName="delete" sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          ) : (
            <Typography
              variant="subtitle2"
              sx={(theme: any) => ({ color: theme.palette.borderColor.main })}
            >
              Choose file to upload
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
