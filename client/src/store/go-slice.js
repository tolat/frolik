import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
      state.outing.users = action.payload;
    },
    addUser(state, action) {
      if (!state.outing.users.find((user) => action.payload._id === user._id))
        state.outing.users.push(action.payload);
    },
    removeUser(state, action) {
      const index = state.outing.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) state.outing.users.splice(index, 1);
    },
    setActivity(state, action) {
      state.outing.activity = action.payload;
    },
    removeActivity(state) {
      state.outing.activity = {};
    },
    reset(state, action) {
      state.outing = { activity: {}, users: [action.payload] };
    },
  },
});

export const goActions = goSlice.actions;

export default goSlice.reducer;
