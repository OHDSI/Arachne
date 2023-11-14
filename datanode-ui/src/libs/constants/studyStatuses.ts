import { StudyStatuses } from "../enums/StudyStatuses";

export const studyStatuses = [
  {
    id: StudyStatuses.INITIATE,
    shortcut: 1,
    name: 'Initiate',
  },
  {
    id: StudyStatuses.ACTIVE,
    shortcut: 2,
    name: 'Active',
  },
  {
    id: StudyStatuses.COMPLETED,
    shortcut: 3,
    name: 'Completed',
  },
  {
    id: StudyStatuses.ARCHIVED,
    shortcut: 4,
    name: 'Archived',
  },
];
