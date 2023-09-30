import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  userID: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userID = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userID = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

