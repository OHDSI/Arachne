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

import { DialogActions } from "./useDialog.constants";
import { getReducerWithProduce } from "../../utils";

export const reducer = (initialState, action) => {
  return getReducerWithProduce(initialState, draft => {
    switch (action.type) {
    case DialogActions.SET_COMPONENT: {
      draft.component = action.payload;
      break;
    }
    case DialogActions.SHOW_DIALOG: {
      draft.component = action.payload.component;
      draft.props = { ...action.payload.props, open: true };
      break;
    }
    case DialogActions.HIDE_DIALOG: {
      draft.props = { ...draft.props, open: false };
      break;
    }
    case DialogActions.DESTROY_DIALOG: {
      draft.component = null;
      draft.props = {};
      break;
    }
    }
  });
};
