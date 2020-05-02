import React, { PureComponent } from 'react';

import { Table, Button } from 'react-bootstrap';
import './ProfileView.css'

class ProfileView extends PureComponent {

    handleEdit = () => {
        this.props.updateUI(2);
    }

    render() {
        return (
            <div className="p-view">
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                        <th>Name</th>
                        <td id="givenName">{this.props.profile.givenName}</td>
                        </tr>
                        <tr>
                        <th>Surname</th>
                        <td id="surname">{this.props.profile.surname}</td>
                        </tr>
                        <tr>
                        <th>Email</th>
                        <td id="userPrincipalName">{this.props.profile.userPrincipalName}</td>
                        </tr>
                        <tr>
                        <th>Job Title</th>
                        <td id="jobTitle">{this.props.profile.jobTitle}</td>
                        </tr>
                        <tr>
                        <th>Mobile Phone</th>
                        <td id="mobilePhone">{this.props.profile.mobilePhone}</td>
                        </tr>
                        <tr>
                        <th>Preferred Language</th>
                        <td id="preferred Language">{this.props.profile.preferredLanguage}</td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="primary" onClick={this.handleEdit}>Edit</Button>
            </div>
        );
    }
}

export default ProfileView;