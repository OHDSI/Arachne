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

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { SpinnerWidgetContainer } from "./libs/components";

import { IndexModuleSubmissions, IndexAdmin } from "./modules";
import { AppLayout, PrivateRoute, Welcome } from "./components";

import { LayoutSpinner } from "./App.styled";

import "./App.css";

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<PrivateRoute />}>
        <Route
          element={<AppLayout />}
        >
          <Route
            index
            element={
              <Welcome />
            }
          />
          <Route
            path="administration/*"
            element={
              <IndexAdmin />
            }
          />
          <Route
            path="submissions/*"
            element={
              <IndexModuleSubmissions root={{ name: "Submissions", path: "/submissions" }} />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
