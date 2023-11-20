import { Status } from '../../enums';
import { IUseListState } from './useList.types';

export const useListInitialState: IUseListState = {
  isLoading: false,
  isLoaded: false,
  isError: false,
  byId: {},
  ids: [],
  actions: null,
  currentlyProcessingId: null,
  processingIds: [],
  status: Status.INITIAL,
  pageCount: 1,
  pageNumber: 0,
  pageSize: 5,
  numberOfElements: 0,
  totalElements: 0,
  allowedSorting: [],
  rawData: [],
};
