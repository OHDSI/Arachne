import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { List } from './List';
import { Entity } from './Entity';

export const IndexDataSource: React.FC<any> = props => {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path=":id/*" element={<Entity />} />
    </Routes>
  );
};