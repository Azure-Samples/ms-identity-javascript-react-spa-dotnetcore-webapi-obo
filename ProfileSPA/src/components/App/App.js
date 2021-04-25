import React from "react";
import ProfileContainer from '../../containers/ProfileContainer';

import { AuthenticatedTemplate, UnauthenticatedTemplate, withMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig';

import {
    Nav,
    Navbar,
    Button,
    Jumbotron
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {

    handleSignIn = () => {
        this.props.msalContext.instance.loginPopup(loginRequest)
            .then((response) => {
                this.props.updateAccount(response.account);
            }).catch((error) => {
                this.props.updateError(error);
            });
    };

    handleSignOut = () => {
        this.props.msalContext.instance.logout({
            account: this.props.msalContext.accounts[0]
        }).then(() => {
            this.props.updateAccount(null);
            this.props.updateToken(null);
        }).catch((error) => {
            this.props.updateError(error);
        });
    }


    render() {

        return (
            <div className="app">
                <Navbar className="navbar" bg="dark" variant="dark">
                    <Navbar.Brand href="/">Microsoft identity platform</Navbar.Brand>
                    <Nav className="mr-auto">
                    </Nav>
                    <AuthenticatedTemplate>
                        <Button variant="info" onClick={this.handleSignOut}>Logout</Button>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <Button variant="outline-info" onClick={this.handleSignIn}>Login</Button>
                    </UnauthenticatedTemplate>
                </Navbar>
                <AuthenticatedTemplate>
                    <ProfileContainer
                        updateToken={this.props.updateToken}
                    />
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <Jumbotron className="welcome">
                        <h1>Azure AD On-Behalf-Of Flow</h1>
                        <p>A React & Redux single-page application authorizing an ASP.NET Core web API
                        to call the Microsoft Graph API on-behalf-of a user via Microsoft Graph SDK.</p>
                        <Button variant="primary"
                            onClick={() => window.open("https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow", "_blank")}
                        >Learn More</Button>

                    </Jumbotron>
                </UnauthenticatedTemplate>
            </div>
        );
    }
}

export default withMsal(App);
