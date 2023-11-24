import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: false,
  globals: false,
  updatingGlobals: false,
  fetchingAuth: false,
  fetchingMatchedUsers: false
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
    },
    setUserFriends(state, action){
      state.user.friends = action.payload
    },
    setGlobals(state, action){
      state.globals = action.payload
    }, 
    setUpdatingGlobals(state,action){
      state.updatingGlobals = action.payload
    },
    setFetchingAuth(state,action) {
      state.fetchingAuth = action.payload
    },
    setFetchingMatchedUsers(state,action){
      state.fetchingMatchedUsers = action.payload
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
