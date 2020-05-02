const initialState = {
    component: 1, // <ProfileRegister />
};

export default (state = initialState, action={}) => {
    switch (action.type) {
        case "UPDATE_UI":
            return Object.assign({}, state, {component: action.payload});     

        default:
            return state
    }
}