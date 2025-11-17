import { combineReducers } from "redux";
import authReducer from "./rootReducer";

const rootReducer = combineReducers({
	authReducer: authReducer,
});

export default rootReducer;
