import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MsalProvider } from '@azure/msal-react';

import App from '../components/App/App';

import {
    updateAccount,
    updateError,
    updateToken,
} from '../actions/updateActions';

class AppContainer extends Component {
    render() {
        return (
            <MsalProvider instance={this.props.instance}>
                <App {...this.props} />
            </MsalProvider>
        );
    }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    updateAccount: (account) => {
        dispatch(updateAccount(account))
    },
    updateError: (error) => {
        dispatch(updateError(error))
    },
    updateToken: (token) => {
        dispatch(updateToken(token))
    },
});

// AppContainer is a container component wrapped by HOC AuthProvider
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
