/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Reducer, useCallback, useEffect, useReducer } from "react";
import {
  createStructure,
} from "./useFileExplorer.utils";
import { resultFileSubmission, resultsSubmission } from "./useFileExplorer.api";
import { INITIAL_STATE, reducer } from "./useFileExplorer.reducer";
import { FileExplorerTypes, UseFileExplorer } from "./useFileExplorer.enum";

export const useFileExplorer = (
  submissionId: number | string,
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
      const fileTree = createStructure(result);
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
    if (state.selectedFile?.path) {
      loadFile(state.selectedFile?.path);
    }
  }, [state.selectedFile]);

  useEffect(() => {
    if (files && files.length > 0) {
    } else {
      getFiles();
    }
  }, [files]);

  return { ...state, selectFile };
};
