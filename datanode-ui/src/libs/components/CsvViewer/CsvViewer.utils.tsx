import React from 'react';
import { parse } from 'papaparse';
// import { getUUID, startCase } from '@prometheus/utils';
// import { Column } from '@prometheus/components';
import { TableCell } from './components';
import { IParseCsvFnReturn } from './CsvViewer.types';
import { startCase } from 'lodash';
import { getUUID } from '../../utils/getUUID';

export function getColumns(
  columnNames: string[],
  emptyColumnNames: string[]
): any {
  return (columnNames || []).map((colName: string) => {
    const columnName = emptyColumnNames.includes(colName)
      ? ''
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
    skipEmptyLines: 'greedy',
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
