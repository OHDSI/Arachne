import React from "react"
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
      {log ? (
        <CodeEditor
          data={log || ''}
          height={'73vh'}
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
  )
}