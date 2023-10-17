import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  radius: 20,
  outing: {
    activity: {},
    users: [],
  },
};
const goSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      if (!state.users.find((id) => action.payload === id))
        state.users.push(action.payload);
    },
    removeUser(state, action) {
      const index = state.users.findIndex(id=> id === action.payload);
      if (index !== -1) state.users.splice(index, 1);
    },
  },
});

export const goActions = goSlice.actions;

export default goSlice.reducer;
