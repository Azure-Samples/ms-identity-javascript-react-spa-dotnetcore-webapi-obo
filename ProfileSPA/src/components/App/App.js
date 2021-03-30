import React from "react";
import PropTypes from "prop-types";
import ProfileContainer from '../../containers/ProfileContainer';

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
        this.props.signIn().then(() => {
            if (this.props.account) {
                this.props.updateAccount(this.props.account);
            } else {
                if (this.props.error) {
                    this.props.updateError(this.props.error);
                } else {
                    this.props.updateError({ errorMessage: 'Sign-in failed. Please try again.' });
                }
            }
        });
    };

    handleSignOut = () => {
        this.props.signOut().then(() => {
            if (!this.props.account) {
                this.props.updateAccount(null);
            } else {
                if (this.props.error) {
                    this.props.updateError(this.props.error);
                } else {
                    this.props.updateError({ errorMessage: 'Sign-out failed. Please try again.' });
                }
            }
        });
    }


    render() {
        return (
            <div className="app">
                <Navbar className="navbar" bg="dark" variant="dark">
                    <Navbar.Brand href="/">Microsoft identity platform</Navbar.Brand>
                    <Nav className="mr-auto">

                    </Nav>
                    {
                        this.props.isAuthenticated ?
                            <Button variant="info" onClick={this.handleSignOut}>Logout</Button>
                            :
                            <Button variant="outline-info" onClick={this.handleSignIn}>Login</Button>
                    }
                </Navbar>
                {
                    this.props.isAuthenticated ?
                        <ProfileContainer
                            acquireToken={this.props.acquireToken}
                            updateToken={this.props.updateToken}
                        />
                        :
                        <Jumbotron className="welcome">
                            <h1>Azure AD On-Behalf-Of Flow</h1>
                            <p>A React & Redux single-page application authorizing an ASP.NET Core web API
                        to call the Microsoft Graph API on-behalf-of a user via Microsoft Graph SDK.</p>
                            <Button variant="primary"
                                onClick={() => window.open("https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow", "_blank")}
                            >Learn More</Button>

                        </Jumbotron>
                }
            </div>
        );
    }
}

App.propTypes = {
    account: PropTypes.object,
    error: PropTypes.string,
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    acquireToken: PropTypes.func.isRequired,
}

export default App;
