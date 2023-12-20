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

import { Middleware } from "redux";

import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";

import createSagaMiddleware, { SagaMiddleware } from "redux-saga";

import reducers from "./reducers";
import sagas from "./sagas";
import { configureStore } from "@reduxjs/toolkit";

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
