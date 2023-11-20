import React from 'react';
import { useModal } from './useModal';
import { UseModalContext, ModalState } from './useModal.types';
import { Modal, ModalTitle } from '../../../libs/components';

export const ModalContext = React.createContext<UseModalContext>({} as any);

export const ModalProvider = ({ children }: ModalState): any => {
  const { openModal, closeModal, ...rest } = useModal();

  const renderModal = () => {
    const currentModal = rest;

    if (currentModal) {
      const { content: ModalComponent, props, title } = currentModal;
      return ModalComponent ? (
        <>
          {title && <ModalTitle onClose={props?.onClose}>{title}</ModalTitle>}
          <ModalComponent />
        </>
      ) : (
        <></>
      );
    }
  };

  return (
    <div>
      <ModalContext.Provider value={{ openModal, closeModal } as any}>
        {children}
        <Modal {...rest.props}>{renderModal()}</Modal>
      </ModalContext.Provider>
    </div>
  );
};
