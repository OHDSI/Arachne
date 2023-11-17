import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { LayoutSpinner } from './App.styled';
import { SpinnerWidgetContainer } from './libs/components/Spinner/SpinnerContainers';

import { PrivateRoute } from './components/PrivateRoute';
import { AppLayout } from './components/AppLayout';
import { appConfig } from './app.config';
import './App.css'
import { Welcome } from './components/Welcome';
import { IndexModuleSubmissions } from './modules/Submissions';
import { IndexAdmin } from './modules/Admin';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <SpinnerWidgetContainer>
        <LayoutSpinner size={70} />
      </SpinnerWidgetContainer>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<PrivateRoute />}>
        <Route
          element={<AppLayout modulesSideNavigation={appConfig} />}
        >
          <Route
            index
            element={
              <Welcome
                modulesSideNavigation={appConfig}
                subModulesLoad={[]}
              />
            }
          />
          <Route
            path="administration/*"
            element={
              <IndexAdmin root={{ name: 'Admin', path: '/administration' }} />
            }
          />
          <Route
            path="submissions/*"
            element={
              <IndexModuleSubmissions root={{ name: 'Submissions', path: '/submissions' }} />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
