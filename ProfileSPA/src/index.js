import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';

import { PublicClientApplication } from "@azure/msal-browser";

import AppContainer from './containers/AppContainer';
import { msalConfig } from './authConfig';

import './index.css';

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders. 
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <Provider store={configureStore()}>
    <AppContainer instance={msalInstance} />
  </Provider>,
  document.getElementById('root')
);