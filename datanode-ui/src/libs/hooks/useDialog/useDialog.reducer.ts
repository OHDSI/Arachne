import { DialogActions } from './useDialog.constants';
import { getReducerWithProduce } from '../../utils';

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
