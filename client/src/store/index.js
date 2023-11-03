import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import modalReducer from "./modal-slice"
import goReducer from "./go-slice"
import dataReducer from "./data-slice"
import socketReducer from "./socket-slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    go: goReducer,
    data: dataReducer,
    socket: socketReducer
  },
});


export default store;
