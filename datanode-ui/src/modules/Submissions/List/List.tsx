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

import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { ModalContext, UseModalContext, useInterval } from "../../../libs/hooks";
import { getUUID, getFormatDateAndTime } from "../../../libs/utils";
import { PageList, useNotifications } from "../../../libs/components";
import { cancelSubmission, createSubmission, getSubmissions } from "../../../api/submissions";
import { setBreadcrumbs } from "../../../store/modules";

import { CreateSubmissionForm } from "../CreateSubmissionForm";
import { SubmissionHeader, SubmissionHeaderItem } from "./List.styles";
import { removeDataSource } from "../../../api/data-sources";
import { colsTableSubmissions } from "../../../config";
import { SubmissionResult } from "../SubmissionResult";
import { SubmissionDTOInterface } from "@/libs/types";
import { RerunSubmissionForm } from "../RerunSubmissionForm";


export const List: React.FC = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const [idReload, setIdReload] = useState<string>(getUUID());
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useNotifications();
  const cols = React.useMemo(() => colsTableSubmissions(t), [t]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t("breadcrumbs.submissions"),
          path: "/submissions",
        }
      ])
    );
  }, [dispatch, t]);

  const onCreate = () => {
    openModal(
      () => (
        <CreateSubmissionForm
          createMethod={createSubmission}
          onCancel={closeModal}
          afterCreate={() => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      t("modals.create_submission.header"),
      {
        closeOnClickOutside: true,
        width: "700px",
        onClose: closeModal,
      }
    );
  };

  const onReload = (id: string) => {
    openModal(
      () => (
        <RerunSubmissionForm
          id={id}
          createMethod={createSubmission}
          onCancel={closeModal}
          afterCreate={() => {
            setIdReload(getUUID());
            closeModal();
          }}
        />
      ),
      t("modals.rerun_submission.header"),
      {
        closeOnClickOutside: true,
        width: "700px",
        onClose: closeModal,
      }
    );
  };

  const onRemove = async (id) => {
    try {
      await cancelSubmission(id);
      enqueueSnackbar({
        message: 'Submission stoped',
        variant: "success",
      } as any);
      setIdReload(getUUID());
    } catch(e) {
      console.log(e);
      enqueueSnackbar({
        message: e.message,
        variant: "error",
      } as any);
    }
  };


  const onOpenResult = (item: SubmissionDTOInterface) => {
    openModal(
      () => (
        <SubmissionResult item={item} />
      ),
      <SubmissionHeader key="modal-header">
        <SubmissionHeaderItem>{t("modals.files_results.header")}</SubmissionHeaderItem>
        {item.finished && (
          <SubmissionHeaderItem smallFont>
            {getFormatDateAndTime(item.finished)}
          </SubmissionHeaderItem>
        )}
      </SubmissionHeader>,
      {
        closeOnClickOutside: true,
        onClose: closeModal,
      }
    );
  };

  useInterval(() => {
    setIdReload(getUUID());
  }, 10000);

  return (
    <PageList
      reloadId={idReload}
      onCreate={onCreate}
      onReload={onReload}
      onRemove={onRemove}
      onRowClick={row => onOpenResult(row.original)}
      listConfig={{
        rowId: "id",
        loadingMessage: t("pages.submissions.loading_message"),
        addButtonTitle: t("pages.submissions.add_button"),
        tableTitle: t("pages.submissions.header"),
        importButtonTitle: t("common.button.import"),
        iconName: "library",
        fetch: getSubmissions,
        remove: removeDataSource,
        listInitialSort: { id: "id", desc: true },
        cols: cols
      }}
      isSilentReload={true}
      allowDelete={true}
      allowRerun={true}
      isCancel={true}
      variant="primary"
    />
  );
};
