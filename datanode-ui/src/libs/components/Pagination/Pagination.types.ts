import { MouseEvent } from 'react';

export interface IPaginationProps {
  total: number;
  onChange: (e: MouseEvent, pageNum: number) => void;
}
