import React from 'react';
import { Grid } from '../../Grid';

export const CustomTableComponent = ({
  page,
  tileComponent: Tile,
  prepareRow,
  onRowClick,
}) => {
  return (
    <Grid container spacing={1} py={2}>
      {page.map((row: any, i: number) => {
        prepareRow(row);
        return (
          <Tile
            className={'tile tile-' + i}
            key={'tile-' + row.original.id + i}
            value={row.original}
            onClick={() => onRowClick(row)}
            row={row}
          />
        );
      })}
    </Grid>
  );
};
