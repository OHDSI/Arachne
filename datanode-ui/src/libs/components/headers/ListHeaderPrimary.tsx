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
import { ListHeaderProps } from "./ListHeader.types";
import { Grid } from "../Grid";
import { Icon } from "../Icon/Icon";
import { transparentize } from "polished";
import { Box, Typography } from "@mui/material";
import { Button } from "../Button/Button";
import { StatusTag } from "../Table";

export const getStatusTagType = (engine) => {
  return engine.status === "OK" ? {
    color: "success",
    text: "Engine available"
  } : {
    color: "error",
    text: "Engine not available"
  }
}

export const ListHeaderPrimary: React.FC<ListHeaderProps> = ({
  iconName,
  title,
  onImport,
  onCreate,
  importButtonName,
  createButtonName,
  canImport,
  canCreate,
  count,
  customButtons,
  engine,
}) => {
  return (
    <>
      <Grid
        container
        mt={2}
        borderBottom="1px solid"
        borderColor="borderColor.main"
        minHeight={54}
        boxSizing="border-box"
      >
        <Grid item xs={12} container spacing={2} pb={1.5} alignItems="center">
          <Grid item>
            {["study", "workspace", "dataCatalog", "library"].includes(
              iconName
            ) ? (
                <Icon
                  iconName={`${iconName}Colored`}
                  sx={{
                    width: "40px",
                    height: "40px",
                    color: "backgroundColor.icon",
                  }}
                />
              ) : (
                <Grid
                  item
                  sx={theme => ({
                    backgroundColor: transparentize(0.8, theme.palette.info.main),
                    borderRadius: "50%",
                    padding: 1,
                    width: 40,
                    height: 40,
                    color: "text.secondary",
                  })}
                >
                  <Icon iconName={iconName || "list"} />
                </Grid>
              )}
          </Grid>
          <Grid item flexGrow={1} display="flex" alignItems="center">
            <Typography variant="h1">{title}</Typography>
            {count != null && (
              <Box
                sx={(theme: any) => ({
                  backgroundColor: transparentize(0.9, theme.palette.info.main),
                  borderRadius: "2px",
                  color: theme.palette.textColor.primary,
                  fontSize: 12,
                  p: "5px",
                  display: "inline-flex",
                  height: 23,
                  boxSizing: "border-box",
                  ml: 2,
                  mr: 2
                })}
              >
                {count}
              </Box>
            )}
            {engine && (
              <StatusTag {...getStatusTagType(engine)}/>
            )}
          </Grid>

          <Grid item>
            {customButtons}
            {canImport && (
              <Button
                onClick={onImport}
                variant="outlined"
                size="small"
                color="secondary"
                startIcon={<Icon iconName="import" />}
                sx={{
                  mr: 2,
                  fontSize: 16,
                  py: 0,
                  px: 2,
                  color: "info.main",
                  borderColor: "borderColor.main",
                  ".start-icon-small svg": {
                    fontSize: 18,
                    opacity: 0.75,
                  },
                }}
                className={"import-entity"}
              >
                {importButtonName || "Import"}
              </Button>
            )}
            {canCreate && (
              <Button
                onClick={onCreate}
                variant="contained"
                color="info"
                size="small"
                startIcon={<Icon iconName="add" />}
                className={"create-entity"}
                sx={{
                  fontSize: 16,
                  py: 0,
                  px: 2,
                  ".start-icon-small svg": {
                    fontSize: 18,
                    opacity: 0.75,
                  },
                }}
              >
                {createButtonName || "Create"}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
