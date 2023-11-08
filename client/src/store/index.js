import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import modalReducer from "./modal-slice";
import goReducer from "./go-slice";
import dataReducer from "./data-slice";
import socketReducer from "./socket-slice";
import chatReducer from "./chat-slice";
import popupReducer from "./popup-slice";

// Remove the serializableCheck middleware
const customizedMiddleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({
    serializableCheck: false, // Disable the serializable state check
  });
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    go: goReducer,
    data: dataReducer,
    socket: socketReducer,
    chat: chatReducer,
    popup: popupReducer,
  },
  middleware: customizedMiddleware,
});

export default store;
