import { MouseEvent } from 'react';
export interface IPaginationProps {
  onChange: (e: MouseEvent, pageNum: number) => void;
  totalPages: number;
}
