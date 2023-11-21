import { FC, useContext, useEffect, useState } from 'react';

import { Route, Routes } from 'react-router';
import { setBreadcrumbs } from '../../../store/modules';
import { useDispatch } from 'react-redux';
import { UsersList } from './UsersList/UsersList';


export const Users: FC<any> = ({ root }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: 'Admin',
          path: `/administration`,
        },
        {
          name: 'Users',
          path: `/administration/users`,
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