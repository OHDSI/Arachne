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

import React, { useEffect, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Grid } from "../../libs/components";
import { BaseInfoWrapper } from "../../libs/components/wrappers";
import { ListHeaderPrimary } from "../../libs/components/headers";
import { TabsNavigationNew } from "../../libs/components/TabsNavigation";
import { setBreadcrumbs } from "../../store/modules";
import { useDispatch } from "react-redux";
import { Databases } from "./Databases";
import { Users } from "./Users";
import { SystemSettings } from "./SystemSettings";
import { EnviromentsList } from "./Enviroments";
import { ApplicationLog } from "./ApplicationLog";
import { tabsAdmin } from "../../config";

export const IndexAdmin: React.FC = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return tabsAdmin(t);
  }, [t]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t("breadcrumbs.admin"),
          path: "",
        }
      ])
    );
  }, [dispatch]);

  return (
    <Grid container flexDirection="column" minHeight="calc(100vh - 50px)">
      <BaseInfoWrapper>
        <ListHeaderPrimary iconName="admin" title={t("pages.administration.header")} />
        <TabsNavigationNew tabs={tabs} withRouting />
      </BaseInfoWrapper>
      <Routes>
        <Route
          index
          element={<Navigate to="databases" replace />}
        />
        <Route path="databases/*" element={<Databases />} />
        <Route path="users/*" element={<Users />} />
        <Route path="environments/*" element={<EnviromentsList />} />
        <Route path="system-settings/*" element={<SystemSettings />} />
        <Route path="application-log/*" element={<ApplicationLog />} />
      </Routes>
    </Grid>
  );
};