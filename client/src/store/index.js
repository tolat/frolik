import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import modalReducer from "./modal-slice"
import goReducer from "./go-slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    go: goReducer,
  },
});


export default store;
