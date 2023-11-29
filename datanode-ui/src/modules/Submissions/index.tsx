import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { List } from './List';


export const IndexModuleSubmissions: React.FC<any> = props => {
  return (
    <Routes>
      <Route index element={<List />} />
    </Routes>
  );
};