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

import { Grid } from "../../../libs/components";
import { LatestSubmissionsHeader } from "../../Submissions/LatestSubmissions/LatestSubmissions.styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListContainer } from "./HomeInfo.styles";

export const HomeInfo: React.FC<any> = (props) => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item xs={12} textAlign={"left"}>
        <LatestSubmissionsHeader>{t("common.components.home_info.header2")}</LatestSubmissionsHeader>
        <ListContainer>
          <ul>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/wiki/R-Code-Development' rel="noreferrer">R Code Development Guide</a>
            </li>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/blob/main/example' rel="noreferrer">Example and Template for R code</a>
            </li>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/wiki/R-Environment-Development' rel="noreferrer"> R Environment Development Guide</a>
            </li>
          </ul>
        </ListContainer>
      </Grid>
    </Grid>
  );
};