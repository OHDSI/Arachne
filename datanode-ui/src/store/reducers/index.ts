import { breadcrumbsReducer, userReducer } from '../modules';
import { AnyAction, combineReducers, Reducer } from 'redux';

const rootReducer = (routerMiddleware: any): Reducer<any, AnyAction> =>
  combineReducers({
    router: routerMiddleware,
    user: userReducer,
    breadcrumbs: breadcrumbsReducer,
  });

export default rootReducer;
