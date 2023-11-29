import { Column as TableColumn } from 'react-table';

export type ColumnInterface<T extends object = {}> = TableColumn<T> & {
  isCropped?: boolean;
  disableSortBy?: boolean;
};