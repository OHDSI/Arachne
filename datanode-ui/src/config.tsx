import { IconButton } from "@mui/material";
import { DateCell, Icon, NameCell, ShowFolderButton, StatusTag, Tooltip } from "./libs/components";
import { originSubmissions } from "./libs/constants";
import { getItemFromConstantArray, getSubmissionStatusInfo } from "./libs/utils";
import { ColumnInterface, SubmissionDTOInterface, TabsInterface } from "./libs/types";
import { CreateSubmissionFormTabs, OriginSubmission, SubmissionResultTabs, SubmissionStatus } from "./libs/enums";
import moment from "moment";

// columns table
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
    minWidth: 100,
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
    Header: 'Duration',
    accessor: 'finished',
    id: 'duration',
    disableSortBy: true,
    Cell: (props): any => {
      if (props.value) {
        const start = moment(props.row.original.submitted);
        const end = moment(props.row.original.finished);
        console.log(start, end)
        var duration = moment.duration(end.diff(start));

        return duration.humanize();
      } else {
        return <>-</>
      }
    },
    isCropped: true,
    minWidth: 100,
    maxWidth: 100,
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
export const colsTableEnviroments = (onOpen): ColumnInterface[] => ([
  {
    Header: 'No',
    accessor: 'id',
    id: 'id',
    width: '2%',
    minWidth: 40,
  },
  {
    Header: 'Label',
    accessor: 'label',
    id: 'label',
    minWidth: 200,
    width: '30%',
    isCropped: true,
    Cell: NameCell,
  },

  {
    Header: 'Descriptor',
    accessor: 'json',
    id: 'actionCell',
    width: '10%',
    minWidth: 80,
    disableSortBy: true,
    Cell: (props) => {
      return (
        <ShowFolderButton onClick={() => onOpen(props.value)} />
      )
    },
  },


])

// tabs
export const tabsSubmissionResult =
  (setActive: (value: SubmissionResultTabs) => void): TabsInterface<SubmissionResultTabs>[] => [
    {
      value: SubmissionResultTabs.FILE_EXPLORER,
      title: 'File explorer',
      onTabClick: setActive,
    },
    {
      value: SubmissionResultTabs.LOG,
      title: 'Logs',
      onTabClick: setActive,
    },
  ];

export const tabsSubmissionForm =
  (setActive: (value: CreateSubmissionFormTabs) => void): TabsInterface<CreateSubmissionFormTabs>[] => [
    {
      value: CreateSubmissionFormTabs.FILES_IN_ARCHIVE,
      title: 'Files in archive',
      onTabClick: setActive,
    },
    {
      value: CreateSubmissionFormTabs.SEPARATE_FILES,
      title: 'Strategus JSON',
      onTabClick: setActive,
    },
  ];

export const tabsAdmin: TabsInterface[] = [
  {
    value: 'databases',
    title: 'Databases',
  },
  {
    value: 'users',
    title: 'Users',
  },
  {
    value: 'enviroments',
    title: 'Enviroments',
  },
  {
    value: 'system-settings',
    title: 'System settings',
  },
];