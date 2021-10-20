import { combineReducers } from "redux";
import userReducer from '../components/auth/user.reducer.js';
import { customTabsReducer } from "../components/custom-tabs/custom-tabs.reducer.js";
import snackbarReducer from "../components/snack-bar/snack-bar.reducer.js";

const rootReducer = combineReducers({
    user: userReducer,
    snackbar: snackbarReducer,
    selectedTab: customTabsReducer,
});

export default rootReducer;