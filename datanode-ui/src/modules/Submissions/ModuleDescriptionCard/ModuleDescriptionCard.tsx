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
import { Paper } from "@mui/material";
import { Grid, Icon } from "../../../libs/components";
import { IconButtonStyled } from "../SimpleRedirectBlock";

export const ModuleDescriptionCard: React.FC<{
  title: string;
  description: string;
  children?: React.ReactNode;
  actions: React.ReactNode;
  onClick?: any;
  iconName: "study" | "workspace" | "library" | "dataCatalog" | "documentation";
}> = ({ children, title, description, actions, iconName, onClick }) => {
  return (
    <Paper elevation={3} sx={{ minHeight: children ? "100%" : "auto" }}>
      <Grid container p={3}>
        <Grid
          item
          xs={12}
          borderBottom={children ? "1px solid" : "none"}
          borderColor="borderColor.main"
          justifyContent="space-between"
          pb={children ? 2 : 0}
          container
          sx={{ cursor: "default" }}
        >
          <IconButtonStyled onClick={onClick}>
            <Icon
              iconName={`${iconName}Colored`}
              sx={{
                width: "100px",
                height: "100px",
                color: "backgroundColor.icon",
              }}
            />
          </IconButtonStyled>
          <Grid item container maxWidth="calc(100% - 116px)" spacing={1}>
            <Grid
              item
              xs={12}
              fontSize={22}
              fontWeight={400}
              color="textColor.header"
            >
              {title}
            </Grid>
            {description && (
              <Grid
                item
                xs={12}
                sx={theme => ({ color: theme.palette.grey[600], fontSize: 13 })}
              >
                {description}
              </Grid>
            )}
            <Grid item xs={12}>
              {actions}
            </Grid>
          </Grid>
        </Grid>
        {children}
      </Grid>
    </Paper>
  );
};
