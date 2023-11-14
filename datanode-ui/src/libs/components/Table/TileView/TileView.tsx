import React from 'react';
import { NoDataText } from '../Table.styles';
// import { Tile } from '../Tile/Tile';
import { Container } from './TileView.styles';

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
            key={'tile' + row.id}
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
