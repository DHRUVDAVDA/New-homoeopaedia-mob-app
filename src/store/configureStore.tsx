import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import { setupInterceptors } from "../helpers/interceptors";
import rootReducer from "../_redux/reducers/index";
import { BackHandler, Platform } from "react-native";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["authReducer"],
};
const exitMiddleware = () => (next: any) => async (action: any) => {
  if (Platform.OS !== "android") {
    await AsyncStorage.clear();
    setTimeout(() => BackHandler.exitApp(), 1000);
  }
  return next(action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  persistedReducer,
  applyMiddleware(createLogger(), exitMiddleware)
);
let persistor = persistStore(store);
setupInterceptors(store.dispatch);

export { store, persistor };
