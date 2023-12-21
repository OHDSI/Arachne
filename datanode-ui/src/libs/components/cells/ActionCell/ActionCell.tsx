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

import React from "react";
import { ActionsContainer } from "./ActionCell.styles";
import { RemoveButton } from "../../RemoveButton";
import { EditButton } from "../../EditButton";
import { ShowFolderButton, ReloadButton } from "../../icon-buttons";

export interface ActionCellProps {
  onRemove?: any;
  onEdit?: any;
  onShowFolder?: (id: string) => void;
  onReload?: (id: string) => void;
  withConfirmation?: boolean;
  entityType?: string;
  entityName?: string;
  children?: React.ReactNode;
  disabled?: string;
  isCancel?: boolean;
  showCancel?: boolean;
}
export const ActionCell: React.FC<ActionCellProps> = ({
  isCancel,
  onEdit,
  onRemove,
  withConfirmation,
  entityType,
  entityName,
  children,
  onShowFolder,
  onReload,
  showCancel
}) => {
  const confirmationMessage = React.useMemo(
    () =>
      `Are you sure you want to ${isCancel ? "cancel": "delete"} ${entityType || "this item"} ${entityName || ""
      }?`,
    [entityName, entityType]
  );
  return (
    <ActionsContainer>
      {children}
      {onEdit && <EditButton onEdit={onEdit} />}
      {onShowFolder && <ShowFolderButton onClick={onShowFolder} />}
      {onReload && <ReloadButton onClick={onReload} />}
      {onRemove && (
        <RemoveButton
          isCancel={isCancel}
          showCancel={showCancel}
          onRemove={onRemove}
          withConfirmation={withConfirmation}
          confirmationMessage={confirmationMessage}
        />
      )}
    </ActionsContainer>
  );
};
