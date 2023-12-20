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
import { parse } from "papaparse";

import { TableCell } from "./components";
import { IParseCsvFnReturn } from "./CsvViewer.types";
import { startCase } from "lodash";
import { getUUID } from "../../utils/getUUID";

export function getColumns(
  columnNames: string[],
  emptyColumnNames: string[]
): any {
  return (columnNames || []).map((colName: string) => {
    const columnName = emptyColumnNames.includes(colName)
      ? ""
      : startCase(colName).toUpperCase();
    return {
      Header: columnName,
      accessor: colName,
      Cell: ({ value }: { value: string }) => (
        <TableCell title={value}>{value}</TableCell>
      ),
    };
  });
}

export function parseCsv(content: string): IParseCsvFnReturn {
  const emptyColumnNames: string[] = [];
  const parsedCsv = parse(content, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader(header: string): string {
      let columnName = header;
      if (!header) {
        const generatedName = getUUID();
        columnName = generatedName;
        emptyColumnNames.push(generatedName);
      }
      return columnName;
    },
  });

  const { data: rows = [], meta = {} } = parsedCsv;
  const columnNames: string[] = (meta as any)?.fields || [];
  return {
    columns: getColumns(columnNames, emptyColumnNames),
    rows,
  };
}
