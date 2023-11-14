import { BreadcrumbsActions } from './breadcrumbs.constants';

export const setBreadcrumbs = (payload: { path: string; name: string }[]) => ({
  type: BreadcrumbsActions.SET_BREADCRUMBS,
  payload,
});

export const resetBreadcrumbs = () => ({
  type: BreadcrumbsActions.RESET_BREADCRUMBS,
});
