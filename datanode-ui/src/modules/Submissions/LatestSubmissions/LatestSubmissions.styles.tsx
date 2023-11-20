import { Grid } from '../../../libs/components';
import styled from '@emotion/styled';
import React from 'react';

export const LatestSubmissionsHeader = styled('div')(({ theme }: any) => ({
  fontSize: 15,
  fontWeight: 'bold',
  color: theme?.palette.textColor.header,
}));

export const LatestSubmissionsList = styled(props => (
  <Grid item xs={12} pt={1.5}>
    <Grid container spacing={1} {...props}>
      {props.children}
    </Grid>
  </Grid>
))({});

export const LatestSubmissionsListItem: any = styled(props => (
  <Grid item xs={12}>
    <div {...props}>{props.children}</div>
  </Grid>
))(({ theme, light }: any) => ({
  fontSize: 13,
  fontWeight: 'bold',
  color: '#41204f',
  backgroundColor: light ? '#f6f8fa' : theme.palette.backgroundColor.main,
  padding: '8px 12px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.info.main + 20,
  },
  '.light-text': {
    fontWeight: 300,
  },
  '.list-item-section': {
    display: 'flex',
    alignItems: 'center',
    '> *:not(:last-child)': {
      marginRight: 12,
    },
  },
}));

export const SubmissionHeader = styled('div')(({ theme }: any) => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: 24,
  fontWeight: 300,
  paddingBottom: 0,
}));

export const SubmissionHeaderItem = styled.div<any>`
  font-size: ${props => (props.smallFont ? '12px' : '24px')};
  /* margin-left: 10px; */
`;
