import React from 'react';
import { Route, Routes } from 'react-router';

import { DatabaseEntity } from '../DatabaseEntity';
import { DatabasesList } from './DatabasesList';

export const Databases: React.FC<any> = ({ root }) => {

  return (
    <>
      <Routes>
        <Route
          path="*"
          element={<DatabasesList />}
        />
        <Route
          path=":id/*"
          element={<DatabaseEntity />}
        />
      </Routes>
    </>
  );
};
