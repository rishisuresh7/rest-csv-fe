import { combineReducers } from "redux";
import userReducer from '../components/auth/user.reducer.js';
import snackbarReducer from "../components/snack-bar/snack-bar.reducer.js";

const rootReducer = combineReducers({
    user: userReducer,
    snackbar: snackbarReducer,
});

export default rootReducer;