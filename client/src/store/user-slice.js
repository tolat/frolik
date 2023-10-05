import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: false
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;

