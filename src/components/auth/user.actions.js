import * as actionTypes from './user.types';

export const setIsLoggedIn = (payload) => ({
    type: actionTypes.SET_LOGGED_IN,
    payload,
});