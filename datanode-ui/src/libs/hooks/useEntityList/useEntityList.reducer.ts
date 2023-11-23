import { Status } from "../../enums";
import { getReducerWithProduce } from "../../utils";
import { EntityListConstants } from "./useEntityList.constants";
import { IEntityList } from "./useEntityList.types";

export const reducer = (initialState: IEntityList, action: any) => {
  return getReducerWithProduce(initialState, (draft: IEntityList) => {
    switch (action.type) {
      case EntityListConstants.FETCH_REQUEST:
        draft.status =
          draft.status === Status.INITIAL
            ? Status.IN_PROGRESS
            : Status.IN_PROGRESS_RELOAD;
        break;
      case EntityListConstants.FETCH_REQUEST_DONE:
        draft.data.tableData = action.payload.content || action.payload.result;
        draft.actions = action.payload.actions;
        draft.pageCount = action.payload.totalPages || 1;
        draft.pageNumber = action.payload.pageable?.pageNumber || 0;
        draft.numberOfElements = action.payload.numberOfElements || action.payload.result.length;
        draft.totalElements = action.payload.totalElements || action.payload.result.length;
        draft.sort = action.payload.sort;
        draft.status = Status.SUCCESS;
        break;
      case EntityListConstants.FETCH_REQUEST_FAILED:
        draft.data.tableData = [];
        draft.actions = [];
        draft.error = action.payload;
        draft.status = Status.ERROR;
        break;
      case EntityListConstants.SET_COUNT:
        draft.pageCount = action.payload;
        break;
      case EntityListConstants.SET_SIZE:
        draft.pageSize = action.payload;
        break;
      case EntityListConstants.SET_NUMBER:
        draft.pageNumber = action.payload;
        break;
      case EntityListConstants.REMOVE_REQUEST:
        break;
      case EntityListConstants.REMOVE_REQUEST_DONE:
        break;
      case EntityListConstants.REMOVE_REQUEST_FAILED:
        break;
      case EntityListConstants.SET_LIST_SORTING:
        draft.allowedSorting = action.payload;
        break;
    }
  });
};