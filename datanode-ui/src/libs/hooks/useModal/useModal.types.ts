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

import { ReactNode } from "react";

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
