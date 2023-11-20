import { Status } from '../../enums';
import type { IEntityList } from './useEntityList.types';

export enum EntityListConstants {
  FETCH_REQUEST = 'FETCH_REQUEST',
  FETCH_REQUEST_DONE = 'FETCH_REQUEST_DONE',
  FETCH_REQUEST_FAILED = 'FETCH_REQUEST_FAILED',
  REMOVE_REQUEST = 'REMOVE_REQUEST',
  REMOVE_REQUEST_DONE = 'REMOVE_REQUEST_DONE',
  REMOVE_REQUEST_FAILED = 'REMOVE_REQUEST_FAILED',
  SET_COUNT = 'SET_COUNT',
  SET_SIZE = 'SET_SIZE',
  SET_QUERY = 'SET_QUERY',
  SET_SORT = 'SET_SORT',
  SET_NUMBER = 'SET_NUMBER',
  SET_LIST_SORTING = 'SET_LIST_SORTING',
  UPDATE_FILTERS = 'UPDATE_FILTERS',
}

export const INITIAL_STATE: IEntityList = {
  data: { tableData: [], filtersData: [] },
  pageCount: 1,
  pageSize: 15,
  isLoading: false,
  isReloadLoading: false,
  pageNumber: 0,
  sort: null,
  totalElements: 0,
  numberOfElements: 0,
  actions: null,
  allowedSorting: [],
  filters: {},
  status: Status.INITIAL,
  error: null,
};
