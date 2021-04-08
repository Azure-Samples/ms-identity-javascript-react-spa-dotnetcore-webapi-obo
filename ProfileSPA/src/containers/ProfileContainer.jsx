import React, { Component } from 'react';
import { connect } from 'react-redux';

import { InteractionRequiredAuthError, InteractionStatus  } from "@azure/msal-browser";
import { withMsal } from "@azure/msal-react";

import ProfileView from '../components/profile/profileView/ProfileView';
import ProfileEdit from '../components/profile/profileEdit/ProfileEdit';
import ProfileRegister from '../components/profile/profileRegister';

import {
    updateProfile,
    updateUI
} from '../actions/updateActions';

import {
    getProfile,
    postProfile,
    putProfile,
} from '../actions/serviceActions';

import { tokenRequest } from '../authConfig';

class ProfileContainer extends Component {

    componentDidMount() {
        if (this.props.msalContext.accounts[0] && this.props.msalContext.inProgress === InteractionStatus.None) {
            this.props.msalContext.instance.acquireTokenSilent({
                ...tokenRequest,
                account: this.props.msalContext.accounts[0]
            }).then((response) => {

                this.props.updateToken(response);

                if (this.props.auth.idToken) {
                    // Our mock database assign user Ids based on MS Graph API account id, which corresponds to the "oid" claim in the id_token
                    // visit https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens for more information

                    try {
                        this.props.getProfile(tokenOID, response.accessToken);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }).catch((error) => {
                // in case if silent token acquisition fails, fallback to an interactive method
                if (error instanceof InteractionRequiredAuthError) {
                    if (this.props.msalContext.accounts[0] && this.props.msalContext.inProgress === InteractionStatus.None) {
                        instance.acquireTokenPopup({
                            ...tokenRequest,
                        }).then((response) => {
                            this.props.updateToken(response);

                            if (this.props.auth.idToken) {
                                // Our mock database assign user Ids based on MS Graph API account id, which corresponds to the "oid" claim in the id_token
                                // visit https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens for more information
                                let tokenOID = response.idTokenClaims['oid'].replace(/-/gi, ''); // removing dashes
            
                                // check if user already exists
                                try {
                                    this.props.getProfile(tokenOID, response.accessToken);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }).catch(error => console.log(error));
                    }
                }
            });
        }
    }

    render() {

        let component = null;

        switch (this.props.ui.component) {
            case 1:
                component = <ProfileRegister {...this.props} />;
                break;
            case 2:
                component = <ProfileEdit {...this.props} />;
                break;
            case 3:
                component = <ProfileView {...this.props} />;
                break;
            default:
                component = <div>No Content</div>;
        }

        return (
            <div>
                {component}
            </div>
        );
    }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    updateUI: (payload) => {
        dispatch(updateUI(payload));
    },
    updateProfile: (payload) => {
        dispatch(updateProfile(payload));
    },
    getProfile: (id) => {
        dispatch(getProfile(id));
    },
    postProfile: (profile) => {
        dispatch(postProfile(profile));
    },
    putProfile: (profile) => {
        dispatch(putProfile(profile));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withMsal(ProfileContainer));