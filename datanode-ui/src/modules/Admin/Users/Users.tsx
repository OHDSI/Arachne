import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router';
import { setBreadcrumbs } from '../../../store/modules';
import { useDispatch } from 'react-redux';
import { UsersList } from './UsersList/UsersList';


export const Users: React.FC<any> = ({ root }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          name: t('breadcrumbs.admin'),
          path: `/administration`,
        },
        {
          name: t('breadcrumbs.users'),
          path: `/administration/users`,
        },
      ])
    );
  }, [dispatch]);

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