import React from 'react';
import { NameWrapper } from './NameCell.styles';

export interface NameCellProps {
  value: string;
}
export const NameCell: React.FC<NameCellProps> = ({ value }) => {
  return <NameWrapper>{value}</NameWrapper>;
};
