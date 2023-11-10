import { Middleware } from 'redux';

import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory, createHashHistory } from 'history';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

// import ownMiddlewares from './middlewares';
import reducers from './reducers';
import sagas from './sagas';
import { configureStore } from '@reduxjs/toolkit';

// const composeEnhancers = composeWithDevTools({});

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    //other options if needed
  });

// collecting middlewares
const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware, routerMiddleware];

export const store = configureStore({
  reducer: reducers(routerReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export const history = createReduxHistory(store);

sagaMiddleware.run(sagas);
