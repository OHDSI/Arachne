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

import React from "react";
import ReactDOM from "react-dom/client";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";

import { history, store } from "./store";

import { theme } from "./utils";

import { DialogProvider, ModalProvider } from "./libs/hooks";
import { NotificationsProvider } from "./libs/components";
import { setupInterceptors } from "./api";

import App from "./App";

import "./libs/utils/i18n";

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
setupInterceptors(store);
root.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <NotificationsProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <DialogProvider>
            <ModalProvider><App /></ModalProvider>
          </DialogProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </Router>
  </Provider>
);
