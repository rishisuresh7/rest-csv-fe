import * as actionTypes from './snack-bar.types';

export const setSnackSuccess = (message) => ({
    type: actionTypes.SET_SNACK_SUCCESS,
    payload: message
});

export const setSnackError = (message) => ({
    type: actionTypes.SET_SNACK_ERROR,
    payload: message,
});

export const setSnackWarning = (message) => ({
    type: actionTypes.SET_SNACK_WARNING,
    payload: message,
});

export const setSnackClose = () => ({
    type: actionTypes.SET_SNACK_CLOSE
});