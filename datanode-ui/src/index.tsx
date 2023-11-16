import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { history, store } from './store';
import { Provider } from 'react-redux';
import { theme } from './utils/theme';
import { ThemeProvider } from '@emotion/react';
import { DialogProvider } from './libs/hooks/useDialog';
import { ModalProvider } from './libs/hooks/useModal';
import { NotificationsProvider } from './libs/components/Notification';
import { setupInterceptors } from './api';

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
