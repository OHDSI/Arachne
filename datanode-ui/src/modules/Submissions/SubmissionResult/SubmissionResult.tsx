import { tabsSubmissionResult } from '../../../config';
import { SubmissionResultTabs } from '../../../libs/enums';
import { Block, FileExplorer, Grid, TabsNavigationNew, LogsViewer } from '../../../libs/components';
import { Paper } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmissionDTOInterface } from '../../../libs/types';

export interface SubmissionResultPropsInterface {
  item: SubmissionDTOInterface;
}

export const SubmissionResult: React.FC<SubmissionResultPropsInterface> = (props) => {
  const {
    item,
  } = props;
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SubmissionResultTabs>(SubmissionResultTabs.FILE_EXPLORER);

  const tabs = useMemo(() => {
    return tabsSubmissionResult(t, setActiveTab)
  }, [setActiveTab, t])
  return (
    <Grid container>
      <Paper elevation={3} sx={{ zIndex: 2, px: 2, width: '100%' }}>
        <TabsNavigationNew tabs={tabs} active={activeTab} />
      </Paper>
      <Block>
        <Grid item container xs={12} p={2} spacing={2}>
          {activeTab === SubmissionResultTabs.FILE_EXPLORER && (
            <Grid item xs={12}>
              <FileExplorer submissionId={item.id} url={'analysis'} />
            </Grid>
          )}
          {activeTab === SubmissionResultTabs.LOG && (
            <Grid item xs={12}>
              <LogsViewer itemId={item.id} />
            </Grid>
          )}
        </Grid>
      </Block>
    </Grid>
  )
}