import { Button, Icon, Tooltip } from '../../../libs/components';
import { DateCell, NameCell } from '../../../libs/components/cells';
import React from 'react';
import { StatusTag } from '../../../libs/components/Table';
import { getSubmissions } from '../../../api/submissions';
import { removeDataSource } from '../../../api/data-sources';
import { getItemFromConstantArray } from '../../../libs/utils/getItemFromConstantArray';
import { originSubmissions } from '../../../libs/constants';
import { getSubmissionStatusInfo } from '../../../libs/utils/getSubmissionStatusInfo';
import { IconButton } from '@mui/material';

export const listConfig: any = {
  rowId: 'id',
  loadingMessage: 'Loading submission...',
  addButtonTitle: 'Add submission',
  tableTitle: 'Submissions',
  importButtonTitle: 'Import',
  iconName: 'library',
  fetch: getSubmissions,
  remove: removeDataSource,
  listInitialSort: { id: 'modified.timestamp', desc: true },
  getCols: () => {
    return [
      {
        Header: 'No',
        accessor: 'centralId',
        id: 'centralId',
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
        accessor: row => row.created?.user.name || '-',
        id: 'created.user.name',
      },
      // {
      //   Header: 'Study',
      //   accessor: 'studyTitle',
      //   maxWidth: 120,
      //   isCropped: true,
      // },
      {
        Header: 'Analysis',
        accessor: row => row.analysisTitle || '-',
        id: 'analysisId',
        maxWidth: 200,
        minWidth: 200,
        width: '30%',
        Cell: NameCell,
        isCropped: true,
      },
      {
        Header: 'Data source',
        accessor: 'dataSourceTitle',
        id: 'dataSource',
        maxWidth: 200,
        minWidth: 200,
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
