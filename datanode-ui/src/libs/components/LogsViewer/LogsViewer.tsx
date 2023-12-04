import React from "react"
import { Grid } from "../Grid";
import { Spinner, SpinnerWidgetContainer } from "../Spinner";
import { Paper } from "@mui/material";
import { useSubmissionLog } from "../../hooks/useSubmissionLog/useSubmissionLog";
import { Status } from "../../enums";
import { CodeEditor } from "../CodeEditor";

export const LogsViewer: React.FC<any> = (props) => {

  const {
    itemId
  } = props;

  const {
    log,
    status
  } = useSubmissionLog(itemId)

  if ([Status.INITIAL, Status.IN_PROGRESS_RELOAD].includes(status)) {
    return (
      <Grid item xs={12} py={'100px'}>
        <SpinnerWidgetContainer>
          <Spinner size={30} />
        </SpinnerWidgetContainer>
      </Grid>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <CodeEditor
        data={log || ''}
        height={'80vh'}
        containerStyles={{ padding: 0 }}
        enableDownload={true}
        enableCopy
        readOnly
      />
    </Paper>
  )
}