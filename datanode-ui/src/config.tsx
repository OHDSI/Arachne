import { IconButton } from "@mui/material";
import { DateCell, Icon, NameCell, StatusTag, Tooltip } from "./libs/components";
import { originSubmissions } from "./libs/constants";
import { getItemFromConstantArray, getSubmissionStatusInfo } from "./libs/utils";
import { ColumnInterface, SubmissionDTOInterface } from "./libs/types";
import { OriginSubmission, SubmissionStatus } from "./libs/enums";

export const colsTableSubmissions: ColumnInterface<any>[] = [
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
    Cell: ({ value }: { value: OriginSubmission }) => {
      return <>{getItemFromConstantArray(originSubmissions, value).name}</>;
    },
  },
  {
    Header: 'Author',
    accessor: (row: SubmissionDTOInterface) => row.author?.fullName || '-',
    id: 'author.fullName',
  },
  {
    Header: 'Study',
    id: 'study',
    maxWidth: 120,
    isCropped: true,
    accessor: (row: SubmissionDTOInterface) => row.study || '-',
    Cell: NameCell,
  },
  {
    Header: 'Analysis',
    accessor: (row: SubmissionDTOInterface) => row.analysis || '-',
    id: 'analysis',
    maxWidth: 100,
    minWidth: 100,
    width: '30%',
    Cell: NameCell,
    isCropped: true,
  },
  {
    Header: 'Data source',
    accessor: 'dataSource.name',
    id: 'dataSource.name',
    maxWidth: 150,
    minWidth: 150,
    isCropped: true,
  },
  {
    Header: 'Submitted',
    accessor: 'submitted',
    id: 'submitted',
    Cell: DateCell,
    isCropped: true,
    minWidth: 150,
    maxWidth: 150,
  },
  {
    Header: 'Finished',
    accessor: 'finished',
    id: 'finished',
    Cell: (props) => {
      return <>{props.value ? <DateCell {...props} /> : '-'}</>;
    },
    isCropped: true,
    minWidth: 150,
    maxWidth: 150,
  },
  {
    Header: 'Environment',
    accessor: (row: SubmissionDTOInterface) => row.environment || '-',
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
    Cell: ({ value }: { value: SubmissionStatus }) => {
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
    disableSortBy: true,
    Cell: ({ row }: { row: { original: SubmissionDTOInterface } }) => {
      const id = row.original.id;
      const status = row.original.status;
      return status === 'EXECUTED' || status === 'EXECUTION_FAILURE' ? (
        <Tooltip text="Download results">
          <IconButton
            color="info"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              window.location.href = `/api/v1/analysis/${id}/results`;
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
export const colsTableDatabase: ColumnInterface[] = [
  {
    Header: 'Name',
    accessor: 'name',
    id: 'name',
    minWidth: 200,
    width: '30%',
    isCropped: true,
    Cell: NameCell,
  },
  {
    Header: 'DBMS type',
    accessor: 'dbmsType',
    id: 'dbmsType',
    width: '10%',
    minWidth: 110,
    isCropped: true
  },
  {
    Header: 'Database',
    accessor: 'connectionString',
    id: 'connectionString',
    minWidth: 120,
    maxWidth: 240,
    isCropped: true,
  },
  {
    Header: 'CDM schema',
    accessor: 'cdmSchema',
    id: 'cdmSchema',
    width: '5%',
    minWidth: 80,
  }
]
export const colsTableUsers: ColumnInterface[] = [
  {
    Header: 'Name',
    accessor: ({ firstname, lastname }: { firstname: string, lastname: string }) => {
      return `${firstname} ${lastname}`
    },
    id: 'name',
    minWidth: 200,
    width: '30%',
    isCropped: true,
    Cell: NameCell,
  },
  {
    Header: 'Email',
    accessor: 'email',
    id: 'email',
    width: '10%',
    minWidth: 200,
    isCropped: true,
    Cell: NameCell,
  },
  {
    Header: 'Roles',
    accessor: 'roles',
    id: 'roles',
    width: '10%',
    minWidth: 200,
    isCropped: true,
    Cell: ({ value }) => value.join(','),
  },
]