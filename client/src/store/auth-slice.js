import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.user.friends = action.payload.populatedFriends
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    deleteUser(state){
      state.user = false
    },
    setUser(state, action){
      state.user = action.payload
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
