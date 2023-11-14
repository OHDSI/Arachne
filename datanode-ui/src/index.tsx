import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { history, store } from './store';
import { Provider } from 'react-redux';
import { theme } from './utils/theme';
import { ThemeProvider } from '@emotion/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>
);
