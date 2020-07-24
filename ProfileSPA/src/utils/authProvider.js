import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'redux';
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest, tokenRequest } from './authConfig';
import { isIE, requiresInteraction } from './authHelper';

// If you support IE, our recommendation is that you sign-in using Redirect flow
const useRedirectFlow = isIE();

const msalApp = new PublicClientApplication(msalConfig);

const AuthHOC = WrappedComponent => class AuthProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account: null,
            error: null,
            username: null,
        };
    }

    componentDidMount = async() => {
        if (useRedirectFlow) {
            msalApp.handleRedirectPromise()
                .then(this.handleResponse)
                .catch(err => {
                    this.setState({error: err.errorMessage});
                    console.error(err);
                });
        }
    }

    getAccounts = async(response) => {
        const currentAccounts = msalApp.getAllAccounts();
        
        if (currentAccounts === null) {
            return;
        } else if (currentAccounts.length > 1) {
            console.warn("Multiple accounts detected.");
            // defaults to the first account
            this.setState({account: response, username: currentAccounts[0].username});
            // add your own account selection logic here
        } else if (currentAccounts.length === 1) {
            this.setState({account: response, username: currentAccounts[0].username});
        }
        return response;
    }

    handleResponse = async(response) => {
        if (response !== null) {
            this.setState({
                account: response,
                username: response.account.username,
            });
        return response;
        } else {
            return this.getAccounts(response);
        }
    }

    acquireToken = async() => {
        tokenRequest.account = this.state.account.account;

        return msalApp.acquireTokenSilent(tokenRequest)
            .then(this.handleResponse)
            .catch(err => {
                if (requiresInteraction(err.errorCode)) {
                    return useRedirectFlow
                        ? msalApp.acquireTokenRedirect(tokenRequest)
                        : msalApp.acquireTokenPopup(tokenRequest);
                } else {
                    console.error('Non-interactive error:', err.errorCode)
                }
        });
    }

    onSignIn = async(redirect) => {
        if (redirect) {
            return msalApp.loginRedirect(loginRequest);
        }

        return msalApp.loginPopup(loginRequest)
            .then(this.handleResponse)
            .catch(err => {
                this.setState({err: err.errorMessage});
            });
    }

    onSignOut = async() => {
        const logoutRequest = {
            account: msalApp.getAccountByUsername(this.state.username)
        };
    
        return msalApp.logout(logoutRequest);
    }

    render() {
        return (
            <WrappedComponent
                {...this.props}
                account={this.state.account}
                error={this.state.error}
                onSignIn={() => this.onSignIn(useRedirectFlow)}
                onSignOut={() => this.onSignOut()}
                acquireToken={() => this.acquireToken()}
            />
        );
    }
};

const mapStateToProps = (state) => state;
    
export default compose(connect(mapStateToProps), AuthHOC)