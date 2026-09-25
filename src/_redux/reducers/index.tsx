import { combineReducers } from "redux";
import authReducer from "./rootReducer";
import purchaseReducer from "./purchaseReducer";

const rootReducer = combineReducers({
  authReducer: authReducer,
  purchaseReducer: purchaseReducer,
});

export default rootReducer;
