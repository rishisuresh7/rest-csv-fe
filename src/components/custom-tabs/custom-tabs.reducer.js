import { SELECT_TAB, SET_FORM_OPEN, SET_FORM_CLOSE } from "./custom-tabs-types";

export const customTabsReducer = (state = { value: 0, name: '', formOpen: false}, action) => {
    switch (action.type) {
        case SELECT_TAB:
            return {...state, ...action.payload}
        case SET_FORM_OPEN:
            return {...state, formOpen: true}
        case SET_FORM_CLOSE:
            return {...state, formOpen: false}
        default:
            return state
    }
}