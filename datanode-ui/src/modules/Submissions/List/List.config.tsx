import React from 'react';

import { IconButton } from '@mui/material';

import { getSubmissions } from '../../../api/submissions';
import { removeDataSource } from '../../../api/data-sources';
import { getItemFromConstantArray, getSubmissionStatusInfo } from '../../../libs/utils';
import { Icon, Tooltip, DateCell, NameCell, StatusTag } from '../../../libs/components';
import { originSubmissions } from '../../../libs/constants';

export const listConfig: any = {
  rowId: 'id',
  loadingMessage: 'Loading submission...',
  addButtonTitle: 'Add submission',
  tableTitle: 'Submissions',
  importButtonTitle: 'Import',
  iconName: 'library',
  fetch: getSubmissions,
  remove: removeDataSource,
  listInitialSort: { id: 'submitted', desc: true },
  getCols: () => {
    return [
      {
        Header: 'No',
        accessor: 'id',
        id: 'id',
      },
      {
        Header: 'Origin',
        accessor: 'origin',
        id: 'origin',
        width: '3%',
        minWidth: 120,
        Cell: (props: any) => {
          return getItemFromConstantArray(originSubmissions, props.value).name;
        },
      },
      {
        Header: 'Author',
        accessor: row => row.author?.fullName || '-',
        id: 'author.fullName',
      },
      {
        Header: 'Study',
        maxWidth: 120,
        isCropped: true,
        accessor: row => row.study || '-',
        Cell: NameCell,
      },
      {
        Header: 'Analysis',
        accessor: row => row.analysis || '-',
        id: 'analysisId',
        maxWidth: 100,
        minWidth: 100,
        width: '30%',
        Cell: NameCell,
        isCropped: true,
      },
      {
        Header: 'Data source',
        accessor: 'dataSource.name',
        id: 'dataSource',
        maxWidth: 150,
        minWidth: 150,
        isCropped: true,
      },
      {
        Header: 'Submitted',
        accessor: 'submitted',
        id: 'created.timestamp',
        Cell: DateCell,
        isCropped: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: 'Finished',
        accessor: 'finished',
        id: 'modified.timestamp',
        Cell: props => {
          return props.value ? <DateCell {...props} /> : '-';
        },
        isCropped: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: 'Environment',
        accessor: row => row.environment || '-',
        id: 'environment',
        maxWidth: 150,
        minWidth: 150,
        width: '30%',
        Cell: NameCell,
        isCropped: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        id: 'status',
        minWidth: 100,
        width: '5%',
        Cell: ({ value }) => {
          const status = getSubmissionStatusInfo(value);
          return status ? (
            <StatusTag text={status.name} color={status.color} />
          ) : (
            <></>
          );
        },
      },
      {
        Header: 'Results',
        accessor: 'status',
        id: 'actionCell',
        width: '3%',
        minWidth: 80,
        Cell: (props: any) => {
          const id = props?.row?.original?.id;
          const status = props?.row?.original?.status;
          return status === 'EXECUTED' || status === 'FAILED' ? (
            <Tooltip text="Download results">
              <IconButton
                color="info"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  window.location.href = `/api/datanode/submissions/${id}/results/download`;
                }}
                sx={{ my: -1 }}
              >
                <Icon iconName="import" fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          );
        },
      },
    ]
  },

};
