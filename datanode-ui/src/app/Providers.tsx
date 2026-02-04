/*
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * See the License for the specific language governing permissions and limitations.
 */

"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { HistoryRouter } from "redux-first-history/rr6";
import { history, store } from "../store";
import { theme } from "../utils";
import { DialogProvider, ModalProvider } from "../libs/hooks";
import { NotificationsProvider } from "../libs/components";
import { setupInterceptors } from "../api";
import "../libs/utils/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupInterceptors(store);
  }, []);

  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <ThemeProvider theme={theme}>
          <NotificationsProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <DialogProvider>
              <ModalProvider>{children}</ModalProvider>
            </DialogProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </HistoryRouter>
    </Provider>
  );
}
