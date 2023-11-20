import React from 'react';

export interface DialogState {
  initialComponent?: React.FC<any>;
  children?: React.ReactNode;
}

export interface UseDialogContext extends DialogState {
  initialComponent?: React.FC<any>;
  children?: React.ReactNode;
  showDialog: <T>(component: React.FC<T>, props: T) => void;
  hideDialog: () => void;
  destroyDialog: () => any;
}
