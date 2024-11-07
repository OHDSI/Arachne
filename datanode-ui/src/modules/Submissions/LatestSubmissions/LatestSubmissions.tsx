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
import { useNavigate } from "react-router-dom";
import {
  LatestSubmissionsList,
  LatestSubmissionsListItem,
  LatestSubmissionsHeader,
} from "./LatestSubmissions.styles";
import { useList } from "../../../libs/hooks";
import { getSubmissions } from "../../../api/submissions";
import { Status, SubmissionStages } from "../../../libs/enums";
import { Spinner, SpinnerWidgetContainer, Grid, StatusTag, EmptyTableStub } from "../../../libs/components";
import { getSubmissionStageInfo, getItemFromConstantArray } from "../../../libs/utils";
import { originSubmissions } from "../../../libs/constants";

export const LatestSubmissions: React.FC<any> = props => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    data: list,
    rawData,
    status,
    getEntityList,
  } = useList({
    methods: {
      read: {
        method: () =>
          getSubmissions(),
      },
    },
  });

  useEffect(() => {
    getEntityList();
  }, [getEntityList]);

  if (status === Status.INITIAL || status === Status.IN_PROGRESS) {
    return (
      <SpinnerWidgetContainer>
        <Spinner size={32} />
      </SpinnerWidgetContainer>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <LatestSubmissionsHeader>{t("common.components.latest_submissions.header")}</LatestSubmissionsHeader>
      </Grid>
      <LatestSubmissionsList>
        {status === Status.SUCCESS &&
          (rawData?.length ? (
            rawData
              .slice(0, 5)
              .map(item => {
                let stageInfo = null;
                const origin = getItemFromConstantArray(
                  originSubmissions,
                  item.origin
                );
                stageInfo = getSubmissionStageInfo(item.stage, item.error);
                return (
                  <LatestSubmissionsListItem
                    key={item.id + "favorite"}
                    onClick={() => {
                      props.openSubmission(item);
                    }}
                  >
                    <div className="list-item-section">
                      <span>
                        {item.analysis}{" "}
                        <span style={{ fontWeight: 300, color: "#016c75" }}>
                          {`[ ${item.dataSource.name} ]`}
                        </span>
                      </span>
                    </div>

                    <div className="list-item-section">
                      {stageInfo && (
                        <StatusTag text={stageInfo.name} color={stageInfo.color} />
                      )}
                    </div>
                  </LatestSubmissionsListItem>
                );
              })
          ) : (
            <LatestSubmissionsListItem light>
              <EmptyTableStub
                noDataText={t("common.components.latest_submissions.no_data")}
                addButtonText={t("common.components.latest_submissions.go_to")}
                onAdd={() => navigate("/submissions")}
              />
            </LatestSubmissionsListItem>
          ))}
        {status === Status.ERROR && (
          <LatestSubmissionsListItem light>
            <EmptyTableStub
              noDataText={t("common.components.latest_submissions.failed_load_message")}
              addButtonText=""
            />
          </LatestSubmissionsListItem>
        )}
      </LatestSubmissionsList>
    </Grid>
  );
};
