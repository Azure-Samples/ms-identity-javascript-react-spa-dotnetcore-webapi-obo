import React from "react";
import PropTypes from "prop-types";
import AuthProvider from "../../utils/AuthProvider";

import { Nav, Navbar, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                </Navbar>
                <Button onClick={ this.props.onSignIn }>Login</Button>
                <Button onClick={ this.props.onSignOut }>Logout</Button>
            </div>
        );
    }
}

App.propTypes = {
    account: PropTypes.object,
    error: PropTypes.string,
    onSignIn: PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
}

export default AuthProvider(App);
