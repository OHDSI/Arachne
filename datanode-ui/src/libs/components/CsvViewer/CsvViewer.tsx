import React, { FC, useMemo, memo, useEffect, useState } from 'react';

import type { ICsvViewerProps } from './CsvViewer.types';
import { CsvViewerContainer } from './CsvViewer.styles';
import { parseCsv } from './CsvViewer.utils';
import { Block } from '../FilterPanel/FilterPanel.styles';
import { Table } from '../Table';

export const CsvViewer: FC<ICsvViewerProps> = memo(props => {
  const { data, height = 500, downloadMethod } = props;
  const [file, setFile] = useState<any>('');
  useEffect(() => {
    async function fetchData() {
      const dataFile = downloadMethod
        ? await downloadMethod(data.id)
        : data.content || data;
      setFile(dataFile);
    }
    fetchData();

    return () => {
      setFile('');
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
