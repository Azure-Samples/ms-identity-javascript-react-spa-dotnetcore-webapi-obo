import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class ProfileContainer extends Component {
    
    componentDidMount = () => {

        // acquire the token and update the store
        this.props.acquireToken().then((response) => {
            if (response) {
                // set access token
                this.props.updateToken(response);

                if (this.props.auth.idToken) {
                    // Our mock database assign user Ids based on MS Graph API account id, which corresponds to the "oid" claim in the id_token
                    // visit https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens for more information
                    let tokenOID = this.props.auth.idToken.oid.replace(/-/gi, ''); // removing dashes

                    // check if user already exists
                    try {
                        this.props.getProfile(tokenOID);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });
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
    updateProfile: (payload) => {
        dispatch(updateProfile(payload));
    },
    updateUI: (payload) => {
        dispatch(updateUI(payload));
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);