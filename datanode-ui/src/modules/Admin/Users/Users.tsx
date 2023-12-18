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

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router";
import { setBreadcrumbs } from "../../../store/modules";
import { useDispatch } from "react-redux";
import { UsersList } from "./UsersList/UsersList";


export const Users: React.FC<any> = ({ root }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t("breadcrumbs.admin"),
          path: "/administration",
        },
        {
          name: t("breadcrumbs.users"),
          path: "/administration/users",
        },
      ])
    );
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="*"
          element={<UsersList />}
        />
      </Routes>
    </>
  );
};