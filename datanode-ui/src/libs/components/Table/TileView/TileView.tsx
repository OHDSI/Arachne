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
import { NoDataText } from "../Table.styles";
// import { Tile } from '../Tile/Tile';
import { Container } from "./TileView.styles";

export interface ITileView {
  prepareRow: any;
  page: any;
  onRowClick: any;
  noDataText: string;
  tileComponent: React.FC<any>;
}

export const TileView: React.FC<ITileView> = ({
  prepareRow,
  page,
  onRowClick,
  noDataText,
  tileComponent,
}) => {
  const Tile: React.FC<any> = tileComponent;
  return page.length ? (
    <Container className="tiles-container">
      {page.map((row: any, i: number) => {
        prepareRow(row);
        return (
          <Tile
            key={"tile" + row.id}
            item={row.original}
            onClick={() => onRowClick && onRowClick(row)}
          ></Tile>
        );
      })}
    </Container>
  ) : (
    <NoDataText>{noDataText}</NoDataText>
  );
};
