import { Middleware } from 'redux';

import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';
import { configureStore } from '@reduxjs/toolkit';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
  });

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware, routerMiddleware];

export const store = configureStore({
  reducer: reducers(routerReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export const history = createReduxHistory(store);

sagaMiddleware.run(sagas);
