import React, { PureComponent } from 'react';

import {
    Form,
    Button,
    Col
} from 'react-bootstrap';

import './ProfileEdit.css'

class ProfileEdit extends PureComponent {

    componentDidMount() {
        this.props.getProfile(this.props.profile.id);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const profile = {
            id: this.props.profile.id,
            givenName: e.target.elements.formGridName.value,
            surname: e.target.elements.formGridSurname.value,
            userPrincipalName: e.target.elements.formGridUPN.value,
            jobTitle: e.target.elements.formGridJob.value,
            mobilePhone: e.target.elements.formGridPhone.value,
            preferredLanguage: e.target.elements.formGridLang.value,
            firstLogin: this.props.profile.firstLogin,
        }

        this.props.putProfile(profile);
    }

    render() {
        return (
            <div className="p-edit">
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>givenName</Form.Label>
                        <Form.Control placeholder="givenName" defaultValue={this.props.profile.givenName}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridSurname">
                        <Form.Label>surname</Form.Label>
                        <Form.Control placeholder="surname" defaultValue={this.props.profile.surname}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridUPN">
                        <Form.Label>userPrincipalName</Form.Label>
                        <Form.Control placeholder="userPrincipalName" defaultValue={this.props.profile.userPrincipalName}/>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridJob">
                        <Form.Label>jobTitle</Form.Label>
                        <Form.Control placeholder="jobTitle" defaultValue={this.props.profile.jobTitle}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPhone">
                        <Form.Label>mobilePhone</Form.Label>
                        <Form.Control placeholder="mobilePhone" defaultValue={this.props.profile.mobilePhone}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridLang">
                        <Form.Label>preferredLanguage</Form.Label>
                        <Form.Control placeholder="preferredLanguage"
                            as="select" defaultValue={this.props.profile.preferredLanguage}>
                                <option>English</option>
                                <option>Chinese</option>
                        </Form.Control>
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default ProfileEdit;