import * as actionTypes from './snack-bar.types';

const initState = {
    open: false,
    severity: '',
    message: ''
};

const snackbarReducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.SET_SNACK_SUCCESS:
            return {
                ...state,
                message: action.payload,
                open: true,
                severity: 'success'
            }
        case actionTypes.SET_SNACK_ERROR:
            return {
                ...state,
                message: action.payload,
                open: true,
                severity: 'error'
            }
        case actionTypes.SET_SNACK_WARNING:
            return {
                ...state,
                message: action.payload,
                open: true,
                severity: 'warning'
            }
        case actionTypes.SET_SNACK_CLOSE:
            return {
                ...state,
                message: '',
                open: false,
                severity: ''
            }
        default:
            return state
    }
}

export default snackbarReducer;