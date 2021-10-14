import * as actionTypes from './user.types.js';

const initState = {
    isLoggedIn: false,
};

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.SET_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: true,
            }
        default:
            return state
    }
}

export default userReducer;