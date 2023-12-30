import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  reloadFlag: false,
};
const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setConnected(state, action) {
      state.isConnected = action.payload;
    },
    setReloadFlag(state, action) {
      state.reloadFlag = action.payload;
    },
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
