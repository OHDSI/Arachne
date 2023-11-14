import { FC, ReactNode } from 'react';

export interface DialogState {
  initialComponent?: FC<any>;
  children?: ReactNode;
}

export interface UseDialogContext extends DialogState {
  initialComponent?: FC<any>;
  children?: ReactNode;
  showDialog: <T>(component: FC<T>, props: T) => void;
  hideDialog: () => void;
  destroyDialog: () => any;
}
