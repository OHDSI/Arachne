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
import { Grid } from "../Grid";
import { Spinner, SpinnerWidgetContainer } from "../Spinner";
import { Paper } from "@mui/material";
import { useSubmissionLog } from "../../hooks/useSubmissionLog/useSubmissionLog";
import { Status } from "../../enums";
import { CodeEditor } from "../CodeEditor";
import { NoDataContainer } from "../FileViewer/FileViewer.styles";

export const LogsViewer: React.FC<any> = (props) => {

  const {
    itemId
  } = props;

  const {
    log,
    status
  } = useSubmissionLog(itemId);

  if ([Status.INITIAL, Status.IN_PROGRESS_RELOAD].includes(status)) {
    return (
      <Grid item xs={12} py={"100px"}>
        <SpinnerWidgetContainer>
          <Spinner size={30} />
        </SpinnerWidgetContainer>
      </Grid>
    );
  }



  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      {log ? (
        <CodeEditor
          data={log || ""}
          height={"73vh"}
          containerStyles={{ padding: 0 }}
          enableDownload={true}
          enableCopy
          readOnly
          consoleMode
        />
      ) : (
        <Grid item xs={12}>
          <NoDataContainer>No available logs</NoDataContainer>
        </Grid>
      )}

    </Paper>
  );
};