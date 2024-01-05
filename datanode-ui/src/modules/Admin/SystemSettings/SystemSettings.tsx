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
import { Navigate, Route, Routes } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider } from "@mui/material";

import { useSystemSettings } from "../../../libs/hooks";
import { setBreadcrumbs } from "../../../store/modules";
import { Status } from "../../../libs/enums";
import {
  Grid,
  SecondaryContentWrapper,
  Spinner,
  SpinnerContainer,
  TabsNavigationNew,
  useNotifications
} from "../../../libs/components";

import { BlockSettings } from "./BlockSettings";
import { TabsInterface } from "../../../libs/types";


export const SystemSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useNotifications();

  const {
    settings,
    status,
    whitelistSections,
    editSystemSettings
  } = useSystemSettings();

  const createTabs = (values: any): TabsInterface[] => values.map(elem => ({ value: elem.name, title: elem.label }));

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t("breadcrumbs.admin"),
          path: "/administration",
        },
        {
          name: t("breadcrumbs.system_settings"),
          path: "/administration/system_settings",
        },
      ])
    );
  }, [dispatch]);

  useEffect(() => {
    if (status === Status.SUCCESS) {
      enqueueSnackbar({
        message: "Settings successfully edited",
        variant: "success",
      } as any);
    }

    if (status === Status.ERROR) {
      enqueueSnackbar({
        message: "Oops something wrong",
        variant: "error",
      } as any);
    }
  }, [status, enqueueSnackbar]);

  if (status === Status.INITIAL || status === Status.IN_PROGRESS_RELOAD) {
    return (
      <SpinnerContainer>
        <Spinner size={62} />
      </SpinnerContainer>
    );
  }

  return (
    <Grid container spacing={2} px={3}>
      {whitelistSections.length > 1 && (
        <Grid item xs={12}>
        <TabsNavigationNew tabs={createTabs(settings)} withRouting secondary />
        <Divider />
      </Grid>
      )}
      <Grid item xs={12} py={3}>
        <SecondaryContentWrapper>
          <Routes>
            <Route
              index
              element={<Navigate to="integration" replace />}
            />
            {settings.map(setting => (
              <Route
                path={setting.name}
                element={
                  <BlockSettings
                    onEdit={editSystemSettings}
                    setting={setting}
                    isLoading={status === Status.IN_PROGRESS}
                  />
                }
              />
            ))}

          </Routes>
        </SecondaryContentWrapper>
      </Grid>
    </Grid>
  );
};
