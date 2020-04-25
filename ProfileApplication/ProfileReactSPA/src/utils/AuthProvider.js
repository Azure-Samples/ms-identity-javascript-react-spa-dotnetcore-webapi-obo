import React, { Component } from "react";
import { msalApp, apiConfig, loginRequest, tokenRequest } from './authConfig';
import { isIE, requiresInteraction, fetchResource } from './authHelper';

// If you support IE, our recommendation is that you sign-in using Redirect flow
const useRedirectFlow = isIE();

export default C => class AuthProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account: null,
            error: null,
        };
    }

    async componentDidMount() {
        msalApp.handleRedirectCallback(error => {
            if (error) {
                const errorMessage = error.errorMessage ? error.errorMessage : "Unable to acquire access token.";
                
                // setState works as long as navigateToLoginRequestUrl: false
                this.setState({error: errorMessage});
            }
        });

        const account = msalApp.getAccount();

        this.setState({account});

        if (account) {
            const tokenResponse = await this.acquireToken(loginRequest, useRedirectFlow);

            if (tokenResponse) {
                // const graphProfile = await fetchMsGraph(
                //     GRAPH_ENDPOINTS.ME,
                //     tokenResponse.accessToken
                // ).catch(() => {
                //     this.setState({error: "Unable to fetch Graph profile."});
                // });

                // if (tokenResponse.scopes.indexOf(apiConfig.resourceScope) > 0) {
                //     return this.readMail(tokenResponse.accessToken);
                // }
            }
        }
    }

    async acquireToken(request, method) {
        return msalApp.acquireTokenSilent(request)
            .catch(error => {
                // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
                // due to consent or interaction required ONLY
                if (requiresInteraction(error.errorCode)) {
                    return method
                        ? msalApp.acquireTokenRedirect(request)
                        : msalApp.acquireTokenPopup(request);
                } else {
                    console.error('Non-interactive error:', error.errorCode)
                }
        });
    }

    async onSignIn(redirect) {

        if (redirect) {
            return msalApp.loginRedirect(loginRequest);
        }

        const loginResponse = await msalApp.loginPopup(loginRequest)
            .catch(error => {
                this.setState({error: error.message});
            });

        if (loginResponse) {
            this.setState({account: loginResponse.account, error: null});

            const tokenResponse = await this.acquireToken(loginRequest)
                .catch(error => {
                    this.setState({error: error.message});
                });

            if (tokenResponse) {
                // const graphProfile = await fetchResource(apiConfig.resourceUri, tokenResponse.accessToken)
                //     .catch(() => {
                //         this.setState({error: "Unable to fetch Graph profile."});
                //     });

                // if (tokenResponse.scopes.indexOf(apiConfig.resourceScopes) > 0) {
                //     return this.readMail(tokenResponse.accessToken);
                // }
            }
        }
    }

    async onSignOut() {
        msalApp.logout();
    }

    render() {
        return (
            <C
                {...this.props}
                account={this.state.account}
                error={this.state.error}
                onSignIn={() => this.onSignIn(useRedirectFlow)}
                onSignOut={() => this.onSignOut()}
            />
        );
    }
};
