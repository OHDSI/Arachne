import { Grid } from "../../../libs/components";
import { LatestSubmissionsHeader } from "../../Submissions/LatestSubmissions/LatestSubmissions.styles";
import React from "react";
import { useTranslation } from 'react-i18next';
import { ListContainer } from "./HomeInfo.styles";

export const HomeInfo: React.FC<any> = (props) => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item xs={12} textAlign={'left'}>
        <LatestSubmissionsHeader>{t('common.components.home_info.header2')}</LatestSubmissionsHeader>
        <ListContainer>
          <ul>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/wiki/R-Code-Development'>R Code Development Guide</a>
            </li>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/blob/main/example'>Example and Template for R code</a>
            </li>
            <li>
              <a target="_blank" href='https://github.com/OHDSI/Arachne/wiki/R-Environment-Development'> R Environment Development Guide</a>
            </li>
          </ul>
        </ListContainer>
      </Grid>
    </Grid>
  )
}