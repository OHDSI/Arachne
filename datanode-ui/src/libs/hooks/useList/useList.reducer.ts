
import { IUseListState } from './useList.types';
import { UseListActionType } from './useList.enums';
import { Status } from '../../enums';
import { convertListToHashMap, getReducerWithProduce } from '../../utils';

export function useListReducer(
  state: IUseListState,
  action: any
) {
  return getReducerWithProduce(state, draft => {
    switch (action.type) {
      case UseListActionType.GET_ENTITY_LIST_PENDING: {
        draft.isError = false;
        draft.isLoading = true;
        draft.processingIds = [];
        draft.status = Status.IN_PROGRESS;
        break;
      }
      case UseListActionType.GET_ENTITY_LIST_SUCCESS: {
        const {
          data,
          primaryKey,
          actions,
          totalPages,
          totalElements,
          numberOfElements,
          number,
        } = action.payload;
        draft.ids = data.map(item => item[primaryKey]);
        draft.byId = convertListToHashMap(data, String(primaryKey));
        draft.rawData = data;
        draft.actions = actions;
        draft.isLoading = false;
        draft.isLoaded = true;
        draft.pageCount = totalPages || 1;
        draft.totalElements = totalElements;
        draft.numberOfElements = numberOfElements;
        draft.pageNumber = number || 0;
        draft.status = Status.SUCCESS;
        break;
      }
      case UseListActionType.GET_ENTITY_LIST_FAILURE: {
        draft.isError = true;
        draft.isLoading = false;
        draft.isLoaded = true;
        draft.status = Status.ERROR;
        break;
      }
      case UseListActionType.GET_ENTITY_SUCCESS: {
        draft.byId[action.payload.id] = action.payload.data;
        break;
      }
      case UseListActionType.CREATE_ENTITY_PENDING: {
        break;
      }
      case UseListActionType.CREATE_ENTITY_SUCCESS: {
        const { data, primaryKey, actions } = action.payload;
        const id = data[primaryKey];
        draft.isLoading = false;
        draft.ids.push(id);
        draft.byId[id] = data;
        draft.actions = actions;
        break;
      }
      case UseListActionType.CREATE_ENTITY_FAILURE: {
        break;
      }
      case UseListActionType.DELETE_ENTITY_PENDING: {
        const { data, primaryKey } = action.payload;
        const id = data[primaryKey];
        draft.processingIds.push(id);
        break;
      }
      case UseListActionType.DELETE_ENTITY_SUCCESS: {
        const { data, primaryKey } = action.payload;
        const id = data[primaryKey];
        draft.ids = draft.ids.filter(itemId => itemId !== id);
        draft.processingIds = draft.processingIds.filter(
          itemId => itemId !== id
        );
        delete draft.byId[id];
        break;
      }
      case UseListActionType.DELETE_ENTITY_FAILURE: {
        break;
      }
      case UseListActionType.GET_ALLOWED_SORTING_SUCCESS: {
        draft.allowedSorting = action.payload.allowedSorting;
        break;
      }
    }
  });
}
