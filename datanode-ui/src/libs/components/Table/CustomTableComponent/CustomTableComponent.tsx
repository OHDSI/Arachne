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
import { Grid } from "../../Grid";

export const CustomTableComponent = ({
  page,
  tileComponent: Tile,
  prepareRow,
  onRowClick,
}) => {
  return (
    <Grid container spacing={1} py={2}>
      {page.map((row: any, i: number) => {
        prepareRow(row);
        return (
          <Tile
            className={"tile tile-" + i}
            key={"tile-" + row.original.id + i}
            value={row.original}
            onClick={() => onRowClick(row)}
            row={row}
          />
        );
      })}
    </Grid>
  );
};
