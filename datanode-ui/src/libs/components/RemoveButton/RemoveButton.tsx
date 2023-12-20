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

import { ConfirmationDialog, ConfirmationDialogProps } from "../Dialogs";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { DialogContext, UseDialogContext } from "../../hooks/useDialog";

export interface RemoveButtonProps {
  onRemove: (e?: React.MouseEvent) => void;
  withConfirmation?: boolean;
  confirmationMessage?: string;
  iconSize?: number;
}

export const RemoveButton: React.FC<RemoveButtonProps> = props => {
  const {
    onRemove,
    withConfirmation = false,
    confirmationMessage = "Are you sure you want to delete this item?",
    iconSize = 18,
  } = props;
  const dialogContext = React.useContext<UseDialogContext>(DialogContext);

  const onDelete = (e: React.MouseEvent) => {
    e?.stopPropagation();
    onRemove(e);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (withConfirmation && dialogContext) {
      dialogContext.showDialog<ConfirmationDialogProps>(ConfirmationDialog, {
        onSubmit: () => onDelete(e),
        onClose: dialogContext?.hideDialog,
        text: confirmationMessage,
        confirmButtonText: "DELETE",
      });
    } else {
      onDelete(e);
    }
  };

  return (
    <Button
      size="xsmall"
      onClick={handleDelete}
      sx={{ width: 26, height: 26, minWidth: 0 }}
    >
      <Icon
        iconName="delete"
        sx={{ fontSize: iconSize, opacity: 0.6 }}
        color="error"
      />
    </Button>
  );
};
