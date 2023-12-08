import { IconButton } from "@mui/material";
import { DateCell, Icon, NameCell, ShowFolderButton, StatusTag, Tooltip } from "./libs/components";
import { originSubmissions } from "./libs/constants";
import { getItemFromConstantArray, getSubmissionStatusInfo } from "./libs/utils";
import { ColumnInterface, DBMSTypesInterface, SubmissionDTOInterface, TabsInterface } from "./libs/types";
import { CreateSubmissionFormTabs, OriginSubmission, SubmissionResultTabs, SubmissionStatus, Roles } from "./libs/enums";
import moment from "moment";

// columns table
export const colsTableSubmissions = (t: any): ColumnInterface<any>[] => [
  {
    Header: t('tables.cols.number'),
    accessor: 'id',
    id: 'id',
  },
  {
    Header: t('tables.cols.origin'),
    accessor: 'origin',
    id: 'origin',
    width: '3%',
    minWidth: 100,
    Cell: ({ value }: { value: OriginSubmission }) => {
      return <>{getItemFromConstantArray(originSubmissions, value).name}</>;
    },
  },
  {
    Header: t('tables.cols.author'),
    accessor: (row: SubmissionDTOInterface) => row.author?.fullName || '-',
    id: 'author.fullName',
  },
  {
    Header: t('tables.cols.analysis'),
    accessor: (row: SubmissionDTOInterface) => row.analysis || '-',
    id: 'analysis',
    maxWidth: 100,
    minWidth: 100,
    width: '30%',
    Cell: NameCell,
    isCropped: true,
  },
  {
    Header: t('tables.cols.data_source'),
    accessor: 'dataSource.name',
    id: 'dataSource.name',
    maxWidth: 150,
    minWidth: 150,
    isCropped: true,
  },
  {
    Header: t('tables.cols.submitted'),
    accessor: 'submitted',
    id: 'submitted',
    Cell: DateCell,
    isCropped: true,
    minWidth: 150,
    maxWidth: 150,
  },
  {
    Header: t('tables.cols.finished'),
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
    Header: t('tables.cols.duration'),
    accessor: 'finished',
    id: 'duration',
    disableSortBy: true,
    Cell: (props): any => {
      if (props.value) {
        const start = moment(props.row.original.submitted);
        const end = moment(props.row.original.finished);
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
    Header: t('tables.cols.env'),
    accessor: (row: SubmissionDTOInterface) => row.environment || '-',
    id: 'environment',
    maxWidth: 150,
    minWidth: 150,
    width: '30%',
    Cell: NameCell,
    isCropped: true,
  },
  {
    Header: t('tables.cols.status'),
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
    Header: t('tables.cols.results'),
    accessor: 'status',
    id: 'actionCell',
    width: '2%',
    minWidth: 30,
    disableSortBy: true,
    Cell: ({ row }: { row: { original: SubmissionDTOInterface } }) => {
      const id = row.original.id;
      const status = row.original.status;
      return status === 'EXECUTED' || status === 'EXECUTION_FAILURE' ? (
        <Tooltip text={t('common.tooltips.download_results')}>
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
export const colsTableDatabase = (t: any, dbmsTypes: DBMSTypesInterface[]): ColumnInterface[] => ([
  {
    Header: t('tables.cols.name'),
    accessor: 'name',
    id: 'name',
    minWidth: 200,
    width: '30%',
    isCropped: true,
    Cell: NameCell,
  },
  {
    Header: t('tables.cols.dbms_type'),
    accessor: 'dbmsType',
    id: 'dbmsType',
    width: '10%',
    minWidth: 110,
    isCropped: true,
    Cell: (props): any => {
      const type = dbmsTypes?.find(elem => elem.id === props.value);
      return type ? type.name : '-'
    }
  },
  {
    Header: t('tables.cols.database'),
    accessor: 'connectionString',
    id: 'connectionString',
    minWidth: 120,
    maxWidth: 240,
    isCropped: true,
  },
  {
    Header: t('tables.cols.cdm_schema'),
    accessor: 'cdmSchema',
    id: 'cdmSchema',
    width: '5%',
    minWidth: 80,
  }
])
export const colsTableUsers = (t: any): ColumnInterface[] => [
  {
    Header: t('tables.cols.name'),
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
    Header: t('tables.cols.email'),
    accessor: 'email',
    id: 'email',
    width: '10%',
    minWidth: 200,
    isCropped: true,
    Cell: NameCell,
  },
  {
    Header: t('tables.cols.roles'),
    accessor: 'roles',
    id: 'roles',
    width: '10%',
    minWidth: 200,
    isCropped: true,
    Cell: ({ value }) => value.map(val => Roles[val]).join(','),
  },
]
export const colsTableEnviroments = (t: any, onOpen): ColumnInterface[] => ([
  {
    Header: t('tables.cols.number'),
    accessor: 'id',
    id: 'id',
    width: '2%',
    minWidth: 40,
  },
  {
    Header: t('tables.cols.label'),
    accessor: 'label',
    id: 'label',
    minWidth: 200,
    width: '30%',
    isCropped: true,
    Cell: NameCell,
  },

  {
    Header: t('tables.cols.descriptor'),
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
  (t: any, setActive: (value: SubmissionResultTabs) => void): TabsInterface<SubmissionResultTabs>[] => [
    {
      value: SubmissionResultTabs.FILE_EXPLORER,
      title: t('modals.files_results.tabs.file_explorer'),
      onTabClick: setActive,
    },
    {
      value: SubmissionResultTabs.LOG,
      title: t('modals.files_results.tabs.logs'),
      onTabClick: setActive,
    },
  ];

export const tabsSubmissionForm =
  (t: any, setActive: (value: CreateSubmissionFormTabs) => void): TabsInterface<CreateSubmissionFormTabs>[] => [
    {
      value: CreateSubmissionFormTabs.FILES_IN_ARCHIVE,
      title: t('modals.create_submission.tabs.files_in_archive'),
      onTabClick: setActive,
    },
    {
      value: CreateSubmissionFormTabs.SEPARATE_FILES,
      title: t('modals.create_submission.tabs.separate_files'),
      onTabClick: setActive,
    },
  ];

export const tabsAdmin = (t: any): TabsInterface[] => [
  {
    value: 'databases',
    title: t('pages.administration.tabs.databases'),
  },
  {
    value: 'users',
    title: t('pages.administration.tabs.users'),
  },
  {
    value: 'environments',
    title: t('pages.administration.tabs.envs'),
  },
  {
    value: 'system-settings',
    title: t('pages.administration.tabs.system_settings'),
  },
];