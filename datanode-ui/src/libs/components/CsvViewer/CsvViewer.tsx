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

import React, { FC, useMemo, memo, useEffect, useState } from "react";

import type { ICsvViewerProps } from "./CsvViewer.types";
import { CsvViewerContainer } from "./CsvViewer.styles";
import { parseCsv } from "./CsvViewer.utils";
import { Block } from "../FilterPanel/FilterPanel.styles";
import { Table } from "../Table";

export const CsvViewer: FC<ICsvViewerProps> = memo(props => {
  const { data, height = 500, downloadMethod } = props;
  const [file, setFile] = useState<any>("");
  useEffect(() => {
    async function fetchData() {
      const dataFile = downloadMethod
        ? await downloadMethod(data.id)
        : data.content || data;
      setFile(dataFile);
    }
    fetchData();

    return () => {
      setFile("");
    };
  }, [data]);

  const { columns, rows } = useMemo(() => parseCsv(file), [file]);

  return (
    <Block>
      <CsvViewerContainer>
        <Table
          columns={columns}
          data={rows}
          isLoading={!file}
          enableSorting
          enablePagination
          totalElements={rows?.length}
        />
      </CsvViewerContainer>
    </Block>
  );
});
