import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import socketReducer from "./socketSlice";
import messageReducer from "./messageSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// Create custom storage
const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem: (key) => {
    return Promise.resolve(localStorage.removeItem(key));
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

// Add socket to serializableCheck ignore list
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socket/setSocket'];
const ignoredPaths = ['socket.socket'];

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    message: messageReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ignoredActions,
        ignoredPaths: ignoredPaths,
      },
    }),
});

export const persistor = persistStore(store);
export default store;
