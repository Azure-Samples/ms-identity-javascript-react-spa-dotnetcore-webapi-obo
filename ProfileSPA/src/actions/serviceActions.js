import {
    updateProfile,
    updateUI,
} from './updateActions';

import { apiConfig } from '../utils/authConfig';

export const getProfile = (id) => (dispatch, getState) => {
    return fetch(apiConfig.resourceUri + '/' + id, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${getState().auth.accessToken}`,
            "Content-Type": 'application/json'
        }
    }).then(response => {
        if (response && response.status !== 404) {
            return response.json();
        }
    })
    .then((response) => {
        if (response) {
            dispatch(updateProfile(response));

            // if the user exists, skip registration
            if (getState().ui.component === 1) {
                dispatch(updateUI(3));
            }
        }
    })
    .catch(err => console.log(err));
};

export const postProfile = (profile) => (dispatch, getState) => {
    return fetch(apiConfig.resourceUri, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${getState().auth.accessToken}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(profile)
    }).then(response => {
        if (response && response.status !== 404) {
            return response.json();
        }
    })
    .then((response) => {
        if (response === 'interaction required') {
            // trigger interaction
        } else {
            dispatch(updateProfile(response))
            dispatch(updateUI(2))
        }
    })
    .catch(err => console.log(err))
};

export const putProfile = (profile) => (dispatch, getState) => {
    return fetch(apiConfig.resourceUri + '/' + profile.id, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${getState().auth.accessToken}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(profile)
    }).then(() => dispatch(updateProfile(profile)))
    .then(() => dispatch(updateUI(3)))
    .catch(err => console.log(err));
};