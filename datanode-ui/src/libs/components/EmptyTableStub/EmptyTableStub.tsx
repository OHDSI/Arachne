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

import { Button, Grid, Icon } from "../";
import React from "react";
import { NoDataText } from "./EmptyTableStub.styles";

export const EmptyTableStub: React.FC<{
  addButtonText?: string;
  noDataText?: string;
  onAdd?: () => void;
  className?: string;
  size?: "small" | "large";
  dark?: boolean;
}> = ({
  addButtonText,
  onAdd,
  className = "",
  size = "small",
  noDataText,
  dark,
}) => {
  return (
    <Grid
      container
      justifyContent="space-around"
      spacing={1}
      p={3}
      className={className + " empty-table-stub"}
    >
      <Grid item xs={12} textAlign="center">
        <Icon
          iconName="emptyTable"
          sx={{ fontSize: size === "small" ? 80 : 160 }}
          color={dark ? "primary" : undefined}
        />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <NoDataText>{noDataText || ""}</NoDataText>
      </Grid>
      {addButtonText && onAdd && (
        <Grid item xs={12} textAlign="center" mt={0.5}>
          <Button
            size="small"
            variant="outlined"
            onClick={onAdd}
            color={dark ? "primary" : "info"}
            startIcon={<Icon iconName="add" />}
            sx={(theme: any) => ({
              fontSize: { xsmall: 14, small: 16 }[size] || 14,
              px: 1.5,
              height: 32,
              fontWeight: 600,
              borderColor: theme.palette.borderColor.main,
              ...(dark && { color: theme.palette.primary.main }),
            })}
          >
            {addButtonText}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
