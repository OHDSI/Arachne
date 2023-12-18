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
import { Tooltip } from "../../Tooltip/Tooltip";
import { Box } from "@mui/material";

export const ListCell: React.FC<{ value: string[] }> = ({ value }) => {
  const itemsHiddenCount = value?.length - 1;
  if (!Array.isArray(value)) {
    console.error("WRONG DATA TYPE PROVIDED FOR <ListCell>");
    return <>-</>;
  }
  return value?.length ? (
    <Tooltip
      text={
        itemsHiddenCount && value
          ? value.map((item, index) => <div key={item + index}>{item}</div>)
          : ""
      }
    >
      <Box component="span">
        {value[0]}
        {!!itemsHiddenCount && (
          <Box
            sx={(theme: any) => ({
              backgroundColor: theme.palette.grey[800],
              borderRadius: "2px",
              color: theme.palette.textColor.primary,
              fontSize: 12,
              p: "3px 4px",
              display: "inline-flex",
              height: 20,
              boxSizing: "border-box",
              ml: 1,
            })}
          >
            + {itemsHiddenCount}
          </Box>
        )}
      </Box>
    </Tooltip>
  ) : (
    <>-</>
  );
};
