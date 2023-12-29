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

import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ModalContext, UseModalContext } from "../../../libs/hooks";
import { PageList, CodeEditor } from "../../../libs/components";
import { colsTableEnviroments } from "../../../config";
import { getEnvironments } from "../../../api/submissions";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../../store/modules";

export const EnviromentsList: React.FC = () => {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t("breadcrumbs.admin"),
          path: "/administration",
        },
        {
          name: t("breadcrumbs.envs"),
          path: "/administration/environments",
        },
      ])
    );
  }, [dispatch]);

  const onOpen = (data) => {
    openModal(
      () => (
        <CodeEditor
          data={data || ""}
          height={"80vh"}
          containerStyles={{ padding: 0 }}
          enableDownload={true}
          language='json'
          enableCopy
          readOnly
        />
      ),
      t("modals.show_descriptor.header"),
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  const cols = React.useMemo(() => colsTableEnviroments(t, onOpen), [t]);

  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: "id",
        loadingMessage: t("pages.administration.envs.loading_message"),
        addButtonTitle: "",
        tableTitle: t("pages.administration.envs.header"),
        importButtonTitle: t("common.buttons.import"),
        listInitialSort: null,
        iconName: "",
        fetch: getEnvironments(),
        cols: cols
      }}
      onRowClick={() => { }}
      variant="primary"
    />
  );
};