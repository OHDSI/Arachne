import { AnyAction, combineReducers, Reducer } from 'redux';

const rootReducer = (routerMiddleware: any): Reducer<any, AnyAction> =>
  combineReducers({
    router: routerMiddleware,
  });

export default rootReducer;
