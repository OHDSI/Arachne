import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  LatestSubmissionsList,
  LatestSubmissionsListItem,
  LatestSubmissionsHeader,
} from './LatestSubmissions.styles';
import { useList } from '../../../libs/hooks';
import { getSubmissions } from '../../../api/submissions';
import { Status } from '../../../libs/enums';
import { Spinner, SpinnerWidgetContainer, Grid, StatusTag, EmptyTableStub } from '../../../libs/components';
import { getSubmissionStatusInfo, getItemFromConstantArray } from '../../../libs/utils';
import { originSubmissions } from '../../../libs/constants';

export const LatestSubmissions: React.FC<any> = props => {
  const navigate = useNavigate();

  const {
    data: list,
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
        <LatestSubmissionsHeader>Latest Submissions</LatestSubmissionsHeader>
      </Grid>
      <LatestSubmissionsList>
        {status === Status.SUCCESS &&
          (Object.values(list.byId)?.length ? (
            Object.values(list.byId)
              .slice(0, 5)
              .map(item => {
                const status = getSubmissionStatusInfo(item.status);
                const origin = getItemFromConstantArray(
                  originSubmissions,
                  item.origin
                );
                return (
                  <LatestSubmissionsListItem
                    key={item.id + 'favorite'}
                    onClick={() => {
                      props.openSubmission(item);
                    }}
                  >
                    <div className="list-item-section">
                      <span>
                        {item.analysis}{' '}
                        <span style={{ fontWeight: 300, color: '#016c75' }}>
                          {`[ ${origin.name} ]`}
                        </span>
                      </span>
                    </div>

                    <div className="list-item-section">
                      {status && (
                        <StatusTag text={status.name} color={status.color} />
                      )}
                    </div>
                  </LatestSubmissionsListItem>
                );
              })
          ) : (
            <LatestSubmissionsListItem light>
              <EmptyTableStub
                noDataText="No Submissions"
                addButtonText="Go to submissions"
                onAdd={() => navigate('/submissions')}
              />
            </LatestSubmissionsListItem>
          ))}
        {status === Status.ERROR && (
          <LatestSubmissionsListItem light>
            <EmptyTableStub
              noDataText="Failed to load submissions"
              addButtonText=""
            />
          </LatestSubmissionsListItem>
        )}
      </LatestSubmissionsList>
    </Grid>
  );
};
