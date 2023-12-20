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
import { useTranslation } from "react-i18next";
import { PageList } from "../../../../libs/components";
import { getUsers, removeUser } from "../../../../api/admin";
import { colsTableUsers } from "../../../../config";

export const UsersList: React.FC = () => {
  const { t } = useTranslation();
  const cols = React.useMemo(() => colsTableUsers(t), [t]);

  return (
    <PageList
      removeId='username'
      listConfig={{
        rowId: "id",
        loadingMessage: t("pages.administration.users.loading_message"),
        addButtonTitle: "",
        tableTitle: t("pages.administration.users.header"),
        importButtonTitle: t("common.buttons.import"),
        listInitialSort: null,
        iconName: "users",
        fetch: getUsers,
        remove: removeUser,
        cols: cols
      }}
      onRowClick={() => { }}
      variant="primary"
    />
  );
};