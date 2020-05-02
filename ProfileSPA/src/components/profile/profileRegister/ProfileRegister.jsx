import React, { PureComponent } from 'react';

import {
    Button,
} from 'react-bootstrap';

import './ProfileRegister.css'

class ProfileRegister extends PureComponent {

    handleRegister = () => {
        this.props.postProfile(this.props.profile);
    }

    render() {
        return (
        <div className="p-register">
            <h3>Welcome Onboard!</h3>
            <p>You will now be asked to update your profile information.</p>
            <Button variant="primary" onClick={this.handleRegister}>Accept</Button>
        </div>
        );
    }
}

export default ProfileRegister;