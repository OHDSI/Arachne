import { Status } from "../../enums";
import { AnyCnameRecord } from "dns";


export interface IEntityList<T extends object = object> {
  data: { tableData: T[]; filtersData: any };
  filters: any;
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
