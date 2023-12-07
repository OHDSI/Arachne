import React from 'react';
import ReactDOM from 'react-dom/client';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';

import { history, store } from './store';

import { theme } from './utils';

import { DialogProvider, ModalProvider } from './libs/hooks';
import { NotificationsProvider } from './libs/components';
import { setupInterceptors } from './api';

import App from './App';

import './libs/utils/i18n';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
setupInterceptors(store);
root.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <NotificationsProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <DialogProvider>
            <ModalProvider><App /></ModalProvider>
          </DialogProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </Router>
  </Provider>
);
