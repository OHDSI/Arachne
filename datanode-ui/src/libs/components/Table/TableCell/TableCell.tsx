import React, { FC, useState, useCallback } from 'react';
import { useTheme } from '@mui/material';
import { StyledTableCell } from './TableCell.styles';
import { Tooltip } from '../../Tooltip/Tooltip';

export interface TableCellProps {
  cell: any;
  style?: any;
  className?: string;
}

export const TableCell: FC<TableCellProps> = ({ cell, style, className }) => {
  const maxWidth = cell.column.maxWidth;
  const minWidth = cell.column.minWidth;
  const width = cell.column.width;
  const isCropped = cell.column.isCropped;
  const shouldShowTooltip =
    typeof cell.column.showTooltip === 'boolean'
      ? cell.column.showTooltip
      : true;
  const [showTooltip, setShowTooltip] = useState(false);

  const tableCellChange = useCallback(
    tableCell => {
      if (tableCell === null) {
        setShowTooltip(false);
      } else {
        setShowTooltip(tableCell?.offsetWidth < tableCell?.scrollWidth);
      }
    },
    [cell]
  );

  return (
    <Tooltip
      text={shouldShowTooltip && showTooltip ? cell.render('Cell') : ''}
      arrow
      color="primary"
      placement="bottom-end"
      sx={{ span: { color: '#ffffff' } }}
    >
      <StyledTableCell
        minWidth={minWidth}
        maxWidth={maxWidth}
        width={width}
        ref={tableCellChange}
        isCropped={isCropped}
        style={style}
        className={className || ''}
      >
        {cell.render('Cell')}
      </StyledTableCell>
    </Tooltip>
  );
};
