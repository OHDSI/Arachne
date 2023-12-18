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
import { ColumnInstance } from "react-table";
import { Checkbox } from "../../Checkbox/Checkbox";
import { DropDownMenu } from "../../DropDownMenu/DropDownMenu";
import {
  buttonStyles,
  labelStyles,
  menuContainerStyles,
  menuItemStyles,
} from "./ColumnSelect.styles";
import { MenuItem } from "@mui/material";

export const ColumnSelect: React.FC<{
  allColumns: Array<ColumnInstance<any>>;
  showColumnToggle: boolean;
  getToggleHideAllColumnsProps: any;
  immutableColumns: Array<string>;
}> = ({
  allColumns,
  showColumnToggle,
  getToggleHideAllColumnsProps,
  immutableColumns = ["actions", "selection"],
}) => {
  const cols = React.useMemo(
    () =>
      allColumns.filter(
        item => !["actions", "selection", ...immutableColumns].includes(item.id)
      ),
    [immutableColumns, allColumns]
  );

  return showColumnToggle ? (
    <DropDownMenu
      size="small"
      title="Columns"
      fullWidth={false}
      sx={buttonStyles}
      preventOverflow
    >
      <div style={menuContainerStyles}>
        <MenuItem key={"select-all"} sx={menuItemStyles}>
          <label style={labelStyles}>
            <Checkbox size="small" {...getToggleHideAllColumnsProps()} />
            <div style={{ marginLeft: 8 }}>Show All</div>
          </label>
        </MenuItem>
        {cols.map(column => {
          return (
            <MenuItem key={column.id} sx={menuItemStyles}>
              <label style={labelStyles}>
                <Checkbox size="small" {...column.getToggleHiddenProps()} />
                <div style={{ marginLeft: 8 }}>
                  {column.id !== "selection"
                    ? column.render("Header")
                    : "Selection"}
                </div>
              </label>
            </MenuItem>
          );
        })}
      </div>
    </DropDownMenu>
  ) : (
    <span></span>
  );
};
