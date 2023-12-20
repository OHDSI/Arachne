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
import { TableCell } from "../TableCell/TableCell";
import {
  StyledTable,
  TableHeadRow,
  TableRow,
  NoDataText,
  ArrowContainer,
} from "../Table.styles";
import { useWindowSize } from "../../common/useWindowSize";
import { Icon } from "../../index";

export const TableComponent: React.FC<{
  getTableProps: any;
  getTableBodyProps: any;
  headerGroups: any;
  prepareRow: any;
  page: any;
  onRowClick?: (row: any) => void;
  disableRowClick?: (row: any) => boolean;
  columnsCnt: number;
  noDataText: string;
  enableSorting: boolean;
  tileView: boolean;
}> = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  prepareRow,
  page,
  onRowClick,
  disableRowClick,
  columnsCnt,
  noDataText,
  enableSorting,
  tileView = false,
}) => {
  const [width] = useWindowSize();

  const generateCellClassName = React.useCallback((cell, index) => {
    const id = cell?.column.id;
    return `table-cell-${id}-${index}`;
  }, []);

  return (
    <StyledTable {...getTableProps()} className="table">
      {!tileView && (
        <thead className="table-head">
          {headerGroups.map((headerGroup: any, i: number) => (
            <TableHeadRow
              {...headerGroup.getHeaderGroupProps()}
              key={"table-header-" + i}
              className="table-row"
            >
              {headerGroup.headers.map((column: any, j: number) => {
                const c =
                  column.rowSpan > 1 && column.columns?.[0]
                  	? column.columns[0]
                  	: column;

                return (
                  <th
                    {...c.getHeaderProps(c.getSortByToggleProps())}
                    key={"table-header-cell-" + j}
                    className={"table-header-cell-" + j}
                    rowSpan={column.rowSpan}
                    style={{
                      textAlign: c.align || "left",
                      cursor:
                        column.disableSortBy || !enableSorting
                        	? "default"
                        	: "pointer",
                      ...(column.invisible ? { display: "none" } : {}),
                    }}
                  >
                    {column.render("Header")}

                    {c.canSort && (
                      <ArrowContainer>{renderArrow(c)}</ArrowContainer>
                    )}
                  </th>
                );
              })}
            </TableHeadRow>
          ))}
        </thead>
      )}
      <tbody {...getTableBodyProps()} className="table-body">
        {page.length ? (
          <>
            {page.map((row: any, i: number) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  key={"table-row-" + i}
                  onClick={e => {
                    e.preventDefault();
                    if (!disableRowClick?.(row)) {
                      onRowClick?.(row);
                    }
                  }}
                  className={"table-row-" + i}
                  tileView={tileView}
                >
                  {row.cells.map((cell: any, j: number) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        key={"table-row-cell-" + j}
                        className={generateCellClassName(cell, i)}
                        cell={cell}
                        width={width}
                        style={{
                          textAlign: cell?.column.align || "left",
                          cursor:
                            !onRowClick || disableRowClick?.(row)
                            	? "default"
                            	: "pointer",
                        }}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </>
        ) : (
          <TableRow className="table-no-data-text">
            <td colSpan={columnsCnt} style={{ padding: 8 }}>
              <NoDataText>{noDataText}</NoDataText>
            </td>
          </TableRow>
        )}
      </tbody>
    </StyledTable>
  );
};

const renderArrow = (column: any) => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return (
        <Icon
          iconName="chevronSorting"
          sx={{ fontSize: "0.5rem", color: "#CDCDCD" }}
        />
      );
    } else {
      return (
        <Icon
          iconName="chevronSorting"
          sx={{
            fontSize: "0.5rem",
            color: "#CDCDCD",
            transform: "rotate(180deg)",
          }}
        />
      );
    }
  }
  return "";
};
