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
import { useModal } from "./useModal";
import { UseModalContext, ModalState } from "./useModal.types";
import { Modal, ModalTitle } from "../../../libs/components";

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
