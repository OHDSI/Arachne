import { FC, useContext, useEffect, useState } from 'react';

import { Route, Routes } from 'react-router';
import { ModalContext, UseModalContext } from '../../../libs/hooks/useModal';
import { setBreadcrumbs } from '../../../store/modules';
import { useDispatch } from 'react-redux';
import { UsersList } from './UsersList/UsersList';


export const Users: FC<any> = ({ root }) => {
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
          name: 'Users',
          path: `/users`,
        },
      ])
    );
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="*"
          element={<UsersList />}
        />
      </Routes>
    </>
  );
};