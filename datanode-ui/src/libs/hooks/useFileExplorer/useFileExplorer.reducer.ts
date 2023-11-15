import { getReducerWithProduce } from '../../utils/getReducerWithProduce';
import { Status } from '../../enums';
import { UseFileExplorer, UseFileExplorerStatus } from './useFileExplorer.enum';

export const INITIAL_STATE = {
  files: null,
  hashMap: null,
  filesContent: null,
  status: Status.INITIAL,
  selectedFile: undefined,
  error: null,
  fileTree: {},
};

export const reducer = (state: any, action: any) => {
  return getReducerWithProduce(state, draft => {
    switch (action.type) {
      case UseFileExplorer.SAVE_FILE_REQUEST:
        draft.status = Status.IN_PROGRESS;
        break;
      case UseFileExplorer.SAVE_FILES_REQUEST_DONE:
        draft.status = Status.SUCCESS;
        draft.fileTree = action.payload.fileTree;
        break;
      case UseFileExplorer.SAVE_FILES_REQUEST_FAILED:
        draft.status = Status.ERROR;
        draft.files = action.payload;
        break;
      case UseFileExplorer.SELECT_FILE:
        if (draft.selectedFile === action.payload) {
          draft.selectedFile = null;
        } else {
          draft.selectedFile = action.payload;
        }
        break;
      case UseFileExplorer.LOAD_FILE_REQUEST:
        draft.status = UseFileExplorerStatus.LOADING_FILE;
        break;
      case UseFileExplorer.LOAD_FILE_REQUEST_DONE:
        draft.status = UseFileExplorerStatus.LOADED_FILE_DONE;
        if (!draft.filesContent) {
          draft.filesContent = {};
        }

        if (action.payload.content) {
          draft.filesContent[action.payload.id] = action.payload.content;
        }
        break;
      case UseFileExplorer.LOAD_FILE_REQUEST_FAILED:
        draft.status = UseFileExplorerStatus.LOADED_FILE_FAILED;
        draft.error = action.payload;
        break;
    }
  });
};
