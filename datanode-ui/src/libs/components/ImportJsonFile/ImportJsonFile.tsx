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

import React, { FC, useRef, useState } from "react";
import { useNotifications } from "../Notification";
import { Grid } from "../Grid";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { IconButton, Typography } from "@mui/material";

// import {
//   Button,
//   Icon,
//   Grid,
//   useNotifications,
//   Typography,
//   IconButton,
// } from '@prometheus/components';

export const ImportJsonFile: FC<any> = props => {
  const {
    onChange,
    titleButton = "Upload file",
    initialTextFile,
    required = false,
  } = props;
  const ref = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (ref && ref.current) {
      ref.current.value = "";
    }
  };

  const { enqueueSnackbar } = useNotifications();
  const [currentFile, setCurrentFile] = useState(
    !initialTextFile
      ? null
      : {
        name: initialTextFile,
      }
  );

  const readFile = file => {
    const reader: any = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      try {
        const parsedJson = JSON.parse(reader.result);
        onChange(parsedJson, file);
        setCurrentFile(file);
      } catch (e) {
        enqueueSnackbar({
          message: "invalid JSON",
          variant: "error",
        } as any);
      }
    };

    reader.onerror = function () {
      enqueueSnackbar({
        message: reader.error,
        variant: "error",
      } as any);
    };
  };

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        p={1.5}
        // border="2px dashed"
        // borderColor="borderColor.main"
        borderRadius={1}
        bgcolor="backgroundColor.main"
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
              accept="application/json"
              ref={ref}
              onChange={e => {
                const file = e.target.files[0];
                readFile(file);
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
                  setCurrentFile(null);
                  onChange(null);
                  reset();
                }}
              >
                <Icon iconName="delete" sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{ sup: { color: "error.main", fontSize: 12 } }}
            >
              Choose file to upload{required && <sup>*</sup>}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
