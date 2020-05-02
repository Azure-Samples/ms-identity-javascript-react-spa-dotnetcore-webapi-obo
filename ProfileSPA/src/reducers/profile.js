const initialState = {
    id: null,
    userPrincipalName: null,
    givenName: null,
    surname: null,
    jobTitle: null,
    mobilePhone: null,
    preferredLanguage: null,
    firstLogin: true,
};

export default (state = initialState, action={}) => {
    switch (action.type) {
        case "UPDATE_PROFILE":
            return Object.assign({}, state, {
                id: action.payload.id,
                userPrincipalName: action.payload.userPrincipalName,
                givenName: action.payload.givenName,
                surname: action.payload.surname,
                jobTitle: action.payload.jobTitle,
                mobilePhone: action.payload.mobilePhone,
                preferredLanguage: action.payload.preferredLanguage,
                firstLogin: false,
            });

        default:
            return state;
    }
}