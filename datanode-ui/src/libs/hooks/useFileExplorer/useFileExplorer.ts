import { Reducer, useCallback, useEffect, useReducer } from 'react';
import {
  // convertFilesExplorerFormat,
  createStructure,
} from './useFileExplorer.utils';
import { resultFileSubmission, resultsSubmission } from './useFileExplorer.api';
import { INITIAL_STATE, reducer } from './useFileExplorer.reducer';
import { FileExplorerTypes, UseFileExplorer } from './useFileExplorer.enum';

export const useFileExplorer = (
  submissionId: string,
  url: string,
  files?: any[]
) => {
  const [state, dispatch] = useReducer<Reducer<any, any>>(
    reducer,
    INITIAL_STATE
  );

  const getFiles = useCallback(async () => {
    dispatch({
      type: UseFileExplorer.SAVE_FILE_REQUEST,
    });

    try {
      const result = await resultsSubmission(submissionId, url);
      const fileTree = createStructure(result.content);
      dispatch({
        type: UseFileExplorer.SAVE_FILES_REQUEST_DONE,
        payload: { fileTree },
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: UseFileExplorer.SAVE_FILES_REQUEST_FAILED,
        payload: e,
      });
    }
  }, []);

  // TODO - check id needed, not used anywhere
  // const initialFiles = (files: any) => {
  //   dispatch({
  //     type: UseFileExplorer.SAVE_FILES_REQUEST_DONE,
  //     payload: convertFilesExplorerFormat(files),
  //   });
  // };

  const selectFile = (fileId: string) => {
    dispatch({
      type: UseFileExplorer.SELECT_FILE,
      payload: fileId,
    });
  };

  const loadFile = useCallback(
    async (fileId: string) => {
      dispatch({
        type: UseFileExplorer.LOAD_FILE_REQUEST,
      });

      if (state.filesContent?.[fileId]) {
        dispatch({
          type: UseFileExplorer.LOAD_FILE_REQUEST_DONE,
          payload: {
            id: fileId,
            content: null,
          },
        });
      } else {
        try {
          const content = await resultFileSubmission(submissionId, fileId, url);
          dispatch({
            type: UseFileExplorer.LOAD_FILE_REQUEST_DONE,
            payload: {
              id: fileId,
              content,
            },
          });
        } catch (e) {
          dispatch({
            type: UseFileExplorer.LOAD_FILE_REQUEST_FAILED,
            payload: e,
          });
        }
      }
    },
    [state.filesContent]
  );

  useEffect(() => {
    if (state.selectedFile?.id) {
      loadFile(state.selectedFile?.id);
    }
  }, [state.selectedFile]);

  useEffect(() => {
    if (files && files.length > 0) {
      // TODO - check id needed, not used anywhere
      // initialFiles(files);
    } else {
      getFiles();
    }
  }, [files]);

  return { ...state, selectFile };
};
