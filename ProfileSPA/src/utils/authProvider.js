import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'redux';

import { msalApp, loginRequest, tokenRequest } from './authConfig';
import { isIE, requiresInteraction } from './authHelper';

// If you support IE, our recommendation is that you sign-in using Redirect flow
const useRedirectFlow = isIE();

const AuthHOC = WrappedComponent => class AuthProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account: null,
            error: null,
        };
    }

    componentDidMount() {
        msalApp.handleRedirectCallback(error => {
            if (error) {
                const errorMessage = error.errorMessage ? error.errorMessage : "Unable to acquire access token.";
                
                // setState works as long as navigateToLoginRequestUrl: false
                this.setState({error: errorMessage});
            }
        });

        const account = msalApp.getAccount();
        this.setState({account});
    }

    async acquireToken() {
        return msalApp.acquireTokenSilent(tokenRequest)
            .catch(error => {
                // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
                // due to consent or interaction required ONLY
                if (requiresInteraction(error.errorCode)) {
                    return useRedirectFlow
                        ? msalApp.acquireTokenRedirect(tokenRequest)
                        : msalApp.acquireTokenPopup(tokenRequest);
                } else {
                    console.error('Non-interactive error:', error.errorCode)
                }
        });
    }

    async onSignIn(redirect) {

        if (redirect) {
            return msalApp.loginRedirect(loginRequest);
        }

        return msalApp.loginPopup(loginRequest)
            .then((account) => {
                this.setState({account});
            })
            .catch(error => {
                this.setState({error: error.errorMessage});
            });
    }

    async onSignOut() {
        msalApp.logout();
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