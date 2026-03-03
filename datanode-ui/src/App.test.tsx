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
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { store } from "./store";
import { theme } from "./utils";
import { DialogProvider, ModalProvider } from "./libs/hooks";
import { NotificationsProvider } from "./libs/components";
import App from "./App";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider theme={theme}>
          <NotificationsProvider
            maxSnack={3}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <DialogProvider>
              <ModalProvider>{children}</ModalProvider>
            </DialogProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
}

test("renders study repository after loading", async () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  // App shows a spinner then Study Repository UI (login is disabled in test env)
  const studyRepoHeading = await screen.findByText(/study repository/i, {}, { timeout: 2000 });
  expect(studyRepoHeading).toBeInTheDocument();
});
