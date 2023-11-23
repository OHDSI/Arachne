import { Status } from "../../enums";
export interface IEntityList<T extends object = object> {
  data: { tableData: T[] };
  allowedSorting: string[];
  actions: any;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  isLoading: boolean;
  isReloadLoading?: boolean;
  status: Status;
  sort: any;
  totalElements: number;
  numberOfElements: number;
  error: any;
}
