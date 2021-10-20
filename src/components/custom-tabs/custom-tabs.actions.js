import { SELECT_TAB, SET_FORM_OPEN, SET_FORM_CLOSE } from "./custom-tabs-types"

export const setSelectedTab = (payload) => {
    return ({
        type: SELECT_TAB,
        payload,
    })
}

export const setFormOpen = () => {
    return ({
        type: SET_FORM_OPEN,
    })
}

export const setFormClose = () => {
    return ({
        type: SET_FORM_CLOSE,
    })
}