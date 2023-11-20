import React from 'react';
import { useDialog } from './useDialog';
import { UseDialogContext, DialogState } from './useDialog.types';

export const DialogContext = React.createContext<UseDialogContext>(null);
export const DialogProvider = ({
  // initialComponent,
  children,
}: DialogState): any => {
  const { component, props, showDialog, hideDialog, destroyDialog } =
    useDialog();

  const renderDialog = () => {
    const DialogComponent = component;
    return DialogComponent ? <DialogComponent {...props} /> : <></>;
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog, destroyDialog }}>
      {children}
      {renderDialog()}
    </DialogContext.Provider>
  );
};
