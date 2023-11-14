import React, { ReactNode, useState } from 'react';

import { INITIAL_STATE } from './useModal.constants';

export const useModal = () => {
  // TODO
  const [state, setState] = useState<any>(INITIAL_STATE);

  const openModal = <T extends object>(
    modalContent: React.FC<T>,
    modalTitle?: ReactNode,
    props?: T
  ) => {
    setState({
      content: modalContent,
      title: modalTitle,
      props: { ...props, open: true },
    });
  };

  const closeModal = () => {
    setState(INITIAL_STATE);
  };

  return { ...state, openModal, closeModal };
};
