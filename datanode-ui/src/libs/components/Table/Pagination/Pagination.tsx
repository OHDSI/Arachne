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

import clsx from "clsx";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PaginationStyled,
  ButtonStyled,
  StyledSelect,
} from "./Pagination.styles";

export interface PaginationProps {
  pageCount: number;
  pageOptions: number[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (item: any) => void;
  previousPage: () => void;
  nextPage: () => void;
  setPageSize?: (pageSize: number) => void;
  pageIndex: number;
  pageSize?: number;
  className?: string;
  totalElements?: number;
  numberOfElements?: number;
  disablePageSize?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  pageOptions,
  canPreviousPage,
  canNextPage,
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
  pageIndex,
  pageSize,
  className,
  totalElements,
  numberOfElements,
  disablePageSize,
}) => {
  const { t } = useTranslation();
  const populatePagesList = () => {
    const list: React.ReactNode[] = [];
    let arr: any[] = [];
    if (pageCount > 5) {
      arr = [1, 2, 3, "...", pageCount];
      if (pageIndex > 1 && pageIndex + 2 < pageCount) {
        arr = [
          1,
          "...",
          pageIndex,
          pageIndex + 1,
          pageIndex + 2,
          "...",
          pageCount,
        ];
      } else if (pageIndex >= pageCount - 3 && pageIndex + 1 <= pageCount) {
        arr = [1, "...", pageCount - 2, pageCount - 1, pageCount];
      }
    } else {
      for (let index = 0; index < pageCount; index++) {
        arr[index] = index + 1;
      }
    }

    arr.forEach((item, i) =>
      list.push(
        typeof item === "string" ? (
          <div className="dots" key={i + "-pagination-dots"}>
            {item}
          </div>
        ) : (
          <ButtonStyled
            onClick={() => gotoPage(item - 1)}
            disabled={pageCount < item}
            size="xsmall"
            fullWidth={false}
            variant="text"
            key={i + "-pagination-btn"}
            className={`pagination-button ${item === pageIndex + 1 ? "active" : ""
            }`}
          >
            {item}
          </ButtonStyled>
        )
      )
    );
    return list;
  };

  const entries = useMemo(() => {
    return t("tables.base.showing", { minRow: pageIndex * pageSize + 1, maxRow: pageIndex * pageSize + numberOfElements, totalRow: totalElements });
  }, [pageIndex, numberOfElements, totalElements, t]);

  return (
    <PaginationStyled className={clsx(className, "table-pagination")}>
      <ButtonStyled
        size="xsmall"
        variant="text"
        fullWidth={false}
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        {"<"}
      </ButtonStyled>
      {populatePagesList()}
      <ButtonStyled
        size="xsmall"
        variant="text"
        fullWidth={false}
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        {">"}
      </ButtonStyled>

      <span>
        {t("tables.base.pagination", { currentPage: pageIndex + 1, totalPage: pageOptions.length })}
      </span>
      <span style={{ marginRight: 10 }}>{numberOfElements > 0 && entries}</span>
      {/* {!disablePageSize && (
        <StyledSelect
          size="small"
          value={pageSize}
          onChange={(e: any) => {
            setPageSize && setPageSize(e);
          }}
          options={[10, 15, 20, 25, 50, 75, 100].map(value => ({
            name: 'Show ' + value,
            value,
          }))}
          name="pageSize"
          fullWidth={false}
        />
      )} */}
    </PaginationStyled>
  );
};
