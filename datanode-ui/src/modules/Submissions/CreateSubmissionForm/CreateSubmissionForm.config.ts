import { CreateSubmissionFormTabs } from "../../../libs/enums/CreateSubmissionFormTabs";


export const tabs = (setActive): any[] => [
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
