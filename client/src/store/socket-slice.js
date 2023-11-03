import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false
};
const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setConnected(state,action){
        state.isConnected = action.payload
    }
  },
});

export const socketActions = socketSlice.actions;

export default socketSlice.reducer;
