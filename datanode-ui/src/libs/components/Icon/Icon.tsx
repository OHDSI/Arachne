/*
 *
 * Copyright 2023 Odysseus Data Services, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

import { AnalysisCharacterization } from "../icons/AnalysisCharacterization";
import { AnalysisIncidence } from "../icons/AnalysisIncidence";
import { AnalysisPathway } from "../icons/AnalysisPathway";
import { Bookmark } from "../icons/Bookmark";
import { Folder } from "../icons/Folder";
import { Library } from "../icons/Library";
import { Add } from "../icons/Add";
import { Admin } from "../icons/Admin";
import { Analysis } from "../icons/Analysis";
import { AnalysisSimpleCount } from "../icons/AnalysisSimpleCount";
import { ChatBubble } from "../icons/ChatBubble";
import { Check } from "../icons/Check";
import { CheckboxEmpty } from "../icons/CheckboxEmpty";
import { CheckboxIndeterminate } from "../icons/CheckboxIndeterminate";
import { CheckboxSelected } from "../icons/CheckboxSelected";
import { Chevron } from "../icons/Chevron";
import { ChevronSorting } from "../icons/ChevronSorting";
import { Close } from "../icons/Close";
import { Cohorts } from "../icons/Cohorts";
import { Collapse } from "../icons/Collapse";
import { ConceptSets } from "../icons/ConceptSets";
import { Copy } from "../icons/Copy";
import { DataCatalog } from "../icons/DataCatalog";
import { DataSources } from "../icons/DataSources";
import { Deactivate } from "../icons/Deactivate";
import { Delete } from "../icons/Delete";
import { Documents } from "../icons/Documents";
import {
  CSV,
  Doc,
  Json,
  Pdf,
  R,
  SQL,
  Txt,
  Unknown,
  Xls,
  ZIP,
} from "../icons/DocumentTypes";
import { ReactComponent as Download } from "../icons/download.svg";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { Edit } from "../icons/Edit";
import { EmptyTable } from "../icons/EmptyTable";
import { Expand } from "../icons/Expand";
import { ReactComponent as Import } from "../icons/import.svg";
import { Invitation } from "../icons/Invitation";
import { List } from "../icons/List";
import { Logout } from "../icons/Logout";
import { Notification } from "../icons/Notification";
import { Participants } from "../icons/Participants";
import { Reload } from "../icons/Reload";
import { Search } from "../icons/Search";
import { Studies } from "../icons/Studies";
import { Submit } from "../icons/Submit";
import { UploadFiles } from "../icons/UploadFiles";
import { Users } from "../icons/Users";
import { Vocabulary } from "../icons/Vocabulary";
import { Workspace } from "../icons/Workspace";
import { ReactComponent as StudyColored } from "../icons/studies.svg";
import { ReactComponent as WorkspaceColored } from "../icons/workspace.svg";
import { ReactComponent as Save } from "../icons/save.svg";
import { ReactComponent as Publish } from "../icons/publish.svg";
import { ReactComponent as Private } from "../icons/private.svg";
import { ReactComponent as Public } from "../icons/public.svg";
import { ReactComponent as LibraryColored } from "../icons/libraryColored.svg";
import { ReactComponent as DataCatalogColored } from "../icons/dataCatalogColored.svg";
import { ReactComponent as Export } from "../icons/export.svg";
import { ReactComponent as SearchPlaceholder } from "../icons/search_placeholder.svg";
import { ReactComponent as Message } from "../icons/message.svg";
import { ReactComponent as Terminated } from "../icons/terminated.svg";
import { ShowFolder } from "../icons/ShowFolder";
import { Github } from "../icons/Girhub";
import { Wiki } from "../icons/Wiki";
import { Documentation } from "../icons/Documentation";

export const icons: { [key: string]: React.FC<any> } = {
  add: Add,
  admin: Admin,
  analysis: Analysis,
  analysisCharacterization: AnalysisCharacterization,
  analysisIncidence: AnalysisIncidence,
  analysisPathway: AnalysisPathway,
  analysisSimpleCount: AnalysisSimpleCount,
  bookmark: Bookmark,
  chatBubble: ChatBubble,
  check: Check,
  checkboxEmpty: CheckboxEmpty,
  checkboxIndeterminate: CheckboxIndeterminate,
  checkboxSelected: CheckboxSelected,
  chevron: Chevron,
  chevronSorting: ChevronSorting,
  close: Close,
  cohort: Cohorts,
  collapse: Collapse,
  conceptSets: ConceptSets,
  copy: Copy,
  csv: CSV,
  dataCatalog: DataCatalog,
  dataCatalogColored: DataCatalogColored,
  dataSources: DataSources,
  deactivate: Deactivate,
  delete: Delete,
  doc: Doc,
  documents: Documents,
  download: Download,
  edit: Edit,
  emptyTable: EmptyTable,
  expand: Expand,
  export: Export,
  folder: Folder,
  import: Import,
  invitation: Invitation,
  json: Json,
  library: Library,
  libraryColored: LibraryColored,
  list: List,
  logout: Logout,
  message: Message,
  notification: Notification,
  participants: Participants,
  pdf: Pdf,
  private: Private,
  public: Public,
  publish: Publish,
  r: R,
  reload: Reload,
  rProfile: R,
  save: Save,
  search: Search,
  searchPlaceholder: SearchPlaceholder,
  sql: SQL,
  study: Studies,
  studyColored: StudyColored,
  submit: Submit,
  terminated: Terminated,
  txt: Txt,
  upload: Upload,
  uploadFiles: UploadFiles,
  users: Users,
  vocabulary: Vocabulary,
  workspace: Workspace,
  workspaceColored: WorkspaceColored,
  xls: Xls,
  zip: ZIP,
  unknown: Unknown,
  showFolder: ShowFolder,
  github: Github,
  wiki: Wiki,
  documentation: Documentation
};

export type IconName = keyof typeof icons;
export type IconProps = SvgIconProps & {
  iconName: IconName;
  // checked?: boolean;
  iconStatus?:
  | "success"
  | "error"
  | "info"
  | "warning"
  | "secondary"
  | "primary";
  plain?: boolean;
};
export const Icon: React.FC<IconProps> = React.forwardRef(
  ({ iconName, iconStatus, plain = false, ...props }, ref) => {
    const Svg: any = icons[iconName] || (() => <></>);

    return (
      <SvgIcon {...props} ref={ref}>
        <Svg
          {...(iconStatus ? { iconStatus } : {})}
          {...(plain ? { plain } : {})}
          color={props.color}
        />
      </SvgIcon>
    );
  }
);
