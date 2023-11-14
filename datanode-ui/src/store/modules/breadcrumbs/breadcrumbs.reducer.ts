import { produce } from 'immer';
import { BreadcrumbsActions } from './breadcrumbs.constants';
import { BreadcrumbsState } from './breadcrumbs.types';

const INITIAL_STATE: BreadcrumbsState = {
  // status: Status.INITIAL,
  breadcrumbs: [],
};

export const breadcrumbsReducer = (state = INITIAL_STATE, action: any) => {
  //@ts-ignore
  return produce(state, (draft: BreadcrumbsState) => {
    switch (action.type) {
      case BreadcrumbsActions.SET_BREADCRUMBS: {
        draft.breadcrumbs = action.payload;
        break;
      }
      case BreadcrumbsActions.RESET_BREADCRUMBS:
        draft.breadcrumbs = [];
        break;
    }
  });
};
