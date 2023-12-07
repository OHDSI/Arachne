import React from 'react';
import { ActionsContainer } from './ActionCell.styles';
import { RemoveButton } from '../../RemoveButton';
import { EditButton } from '../../EditButton';
import { ShowFolderButton, ReloadButton } from '../../icon-buttons';

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
}
export const ActionCell: React.FC<ActionCellProps> = ({
  onEdit,
  onRemove,
  withConfirmation,
  entityType,
  entityName,
  children,
  onShowFolder,
  onReload
}) => {
  const confirmationMessage = React.useMemo(
    () =>
      `Are you sure you want to delete ${entityType || 'this item'} ${entityName || ''
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
          onRemove={onRemove}
          withConfirmation={withConfirmation}
          confirmationMessage={confirmationMessage}
        />
      )}
    </ActionsContainer>
  );
};
