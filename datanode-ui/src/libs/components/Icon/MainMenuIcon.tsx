import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { Library } from '../icons/Library';
import { LibrarySelected } from '../icons/LibrarySelected';
import { Admin } from '../icons/Admin';
import { AdminSelected } from '../icons/AdminSelected';
import { DataCatalog } from '../icons/DataCatalog';
import { DataCatalogSelected } from '../icons/DataCatalogSelected';
import { Studies } from '../icons/Studies';
import { StudiesSelected } from '../icons/StudiesSelected';
import { Users } from '../icons/Users';
import { UsersSelected } from '../icons/UsersSelected';
import { Vocabulary } from '../icons/Vocabulary';
import { VocabularySelected } from '../icons/VocabularySelected';
import { Workspace } from '../icons/Workspace';
import { WorkspaceSelected } from '../icons/WorkspaceSelected';

export const mainMenuIcons: { [key: string]: React.FC<any> } = {
  admin: Admin,
  adminSelected: AdminSelected,
  dataCatalog: DataCatalog,
  dataCatalogSelected: DataCatalogSelected,
  library: Library,
  librarySelected: LibrarySelected,
  study: Studies,
  studySelected: StudiesSelected,
  users: Users,
  usersSelected: UsersSelected,
  vocabulary: Vocabulary,
  vocabularySelected: VocabularySelected,
  workspace: Workspace,
  workspaceSelected: WorkspaceSelected,
};
export type MainMenuIconName = keyof typeof mainMenuIcons;
export type MainMenuIconProps = SvgIconProps & {
  iconName: MainMenuIconName;
  // checked?: boolean;
  iconStatus?:
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'secondary'
  | 'primary';
};
export const MainMenuIcon: React.FC<MainMenuIconProps> = React.forwardRef(
  ({ iconName, iconStatus, ...props }, ref) => {
    const Svg: any = mainMenuIcons[iconName] || (() => <></>);
    return (
      <SvgIcon {...props} ref={ref}>
        <Svg {...(iconStatus ? { iconStatus } : {})} />
      </SvgIcon>
    );
  }
);
