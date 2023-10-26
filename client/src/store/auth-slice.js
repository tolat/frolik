import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: false,
  categoryColorMap:{}
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.user.friends = action.payload.populatedFriends
      state.globals = action.payload.globals
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    deleteUser(state){
      state.user = false
    },
    setUser(state, action){
      state.user = action.payload
    },
    setUserFriends(state, action){
      state.user.friends = action.payload
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
