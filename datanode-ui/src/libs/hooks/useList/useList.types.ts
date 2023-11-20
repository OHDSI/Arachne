import { Status } from '../../enums';

export interface IMethod {
  method: Function;
  errMsg?: string;
}

export interface IReadMethod extends IMethod {
  formatter?: Function;
}

export interface IMethods {
  read?: IReadMethod;
  create?: IMethod;
  get?: IReadMethod;
  update?: IMethod;
  delete?: IMethod;
  sort?: IMethod;
}

export interface IUseListProps {
  primaryKey?: string;
  autoLoad?: boolean;
  async?: boolean;
  values?: any[];
  methods?: IMethods;
}

export interface IUseListData {
  byId: Record<any, any>;
  ids: any[];
}

export interface IUseList {
  data: IUseListData;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  processingIds: Array<any>;
  getEntityList: (params?: any, customFormatter?: Function) => Promise<void>;
  createEntity: (entity: any, async?: boolean) => Promise<void>;
  updateEntity: (entity: any, async?: boolean) => Promise<void>;
  removeEntity: (entity: any, async?: boolean) => Promise<void>;
  getEntity: any;
  actions?: any[];
  status: Status;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  allowedSorting?: string[];
  rawData: any;
}

export interface IUseListState {
  byId: Record<any, any>;
  ids: any[];
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  currentlyProcessingId: any;
  processingIds: Array<any>;
  actions?: any[];
  status: Status;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  allowedSorting?: string[];
  rawData: any[];
}

export interface IEntityIntitialPayload { }
export interface IEntityPayload extends IEntityIntitialPayload {
  data: any;
  primaryKey: any;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  number?: number;
}
export interface IEntityPendingPayload extends IEntityPayload { }
export interface IEntitySuccessPayload extends IEntityPayload {
  actions?: any[];
}
export interface IEntityFailurePayload extends IEntityIntitialPayload {
  err: any;
}

export interface IEntitySortingSuccessPayload {
  allowedSorting: string[];
}
