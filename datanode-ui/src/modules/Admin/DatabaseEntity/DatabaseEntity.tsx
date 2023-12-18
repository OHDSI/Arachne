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

import { Route, Routes, useParams } from "react-router";
import { tabs } from "./DatabaseEntity.config";
import React, { useContext, useEffect } from "react";

import { OmopCdmSettings } from "./OmopCdmSettings";
import { useDispatch } from "react-redux";

import { ConnectionDetails } from "./ConnectionDetails";
import { DialogContext, UseDialogContext, useEntity } from "../../../libs/hooks";

import { setBreadcrumbs } from "../../../store/modules";
import { Status } from "../../../libs/enums";
import { ConfirmationDialog, Grid, TabsNavigationNew, Block, NestedInfoWrapper, SecondaryContentWrapper, Spinner, SpinnerContainer } from "../../../libs/components";

import { Divider } from "@mui/material";

import { DatabaseBaseInfo } from "./DatabaseBaseInfo";
import { getDataSource, removeDataSource, updateDataSource } from "../../../api/data-sources";
import { ErrorPage } from "../../../libs/components/ErrorPage";
import { DataSourceDTOInterface } from "@/libs/types";

export const DatabaseEntity: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { showDialog, hideDialog } =
    useContext<UseDialogContext>(DialogContext);

  const { entity, status, updateEntity, deleteEntity, error } = useEntity<DataSourceDTOInterface>(
    {
      get: getDataSource,
      update: updateDataSource,
      delete: removeDataSource,
    },
    id
  );

  const handleSave = (newValue: any, keyFile?: any, isAdmin?: boolean) => {
    const fd = new FormData();
    fd.append(
      "datasource",
      new Blob([JSON.stringify(newValue)], {
        type: "application/json",
      })
    );

    fd.append(isAdmin ? "adminKeyfile" : "keyfile", keyFile || null);
    updateEntity(fd);
  };

  useEffect(() => {
    entity &&
      dispatch(
      	setBreadcrumbs([
      		{
      			name: "Admin",
      			path: "",
      		},
      		{
      			name: "Databases",
      			path: "/databases",
      		},
      		{
      			name: entity.name,
      			path: `/databases/${entity.id}`,
      		},
      	])
      );
  }, [entity, dispatch]);

  const handleDelete = () => {
    showDialog<any>(ConfirmationDialog, {
      onSubmit: deleteEntity,
      onClose: hideDialog,
      text: "Are you sure you want to delete database?",
      confirmButtonText: "DELETE",
      variant: "error",
    });
  };

  if (status === Status.INITIAL || status === Status.IN_PROGRESS) {
    return (
      <SpinnerContainer>
        <Spinner size={62} />
      </SpinnerContainer>
    );
  }

  if (status === Status.ERROR) {
    return (
      <Grid container p={6}>
        <ErrorPage {...error} noAction />
      </Grid>
    );
  }

  return (
    <Grid container px={3} flexGrow={1} flexDirection="column">
      <NestedInfoWrapper>
        <DatabaseBaseInfo
          entity={entity}
          onSubmit={handleSave}
          onDelete={handleDelete}
        />
      </NestedInfoWrapper>
      <Grid container>
        <Grid item xs={12}>
          <TabsNavigationNew tabs={tabs} withRouting secondary />
          <Divider />
        </Grid>
        <Grid item xs={12} py={3}>
          <SecondaryContentWrapper>
            <Routes>
              <Route
                index
                element={
                  <ConnectionDetails
                    updateEntity={handleSave}
                    entity={entity}
                  />
                }
              />
              <Route
                path="omop-cdm-config/*"
                element={
                  <Block>
                    <OmopCdmSettings
                      entity={entity}
                      updateEntity={handleSave}
                    />
                  </Block>
                }
              />
            </Routes>
          </SecondaryContentWrapper>
        </Grid>
      </Grid>
    </Grid>
  );
};
