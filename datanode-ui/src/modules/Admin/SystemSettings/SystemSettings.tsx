import { FC, useContext, useEffect, useState } from 'react';

import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../../../store/modules';


export const SystemSettings: FC<any> = ({ root }) => {
  const { openModal, closeModal } = useContext<UseModalContext>(ModalContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: ``,
        },
        {
          name: 'System Settings',
          path: `/system-settings`,
        },
      ])
    );
  }, []);

  return (
    <>
      System settings
    </>
  );
};