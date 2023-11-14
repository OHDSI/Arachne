import { FC, ReactNode } from 'react';


export interface ModalState {
  modal?: ModalEntity;
  children?: ReactNode;
}

export interface UseModalContext extends ModalState {
  openModal: <T>(
    modalContent: React.FC<T>,
    modalTitle?: ReactNode,
    props?: T
  ) => void;
  closeModal: () => void;
}

export interface ModalEntity {
  content: any;
  title?: string;
  props?: any;
}
