import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {},
};

const findOrCreateUser = (state, action) => {
  // Create user objet in store if none exists
  if (
    !Object.keys(state.users).find((key) => key === action.payload.userID)
  ) {
    state.users[action.payload.userID] = {
      profile_picture: false,
      photos: [],
    };
  }
  return state.users[action.payload.userID];
};

const dataSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setUserProfilePicture(state, action) {
      const user = findOrCreateUser(state, action);
      user.profile_picture = action.payload.photoString;
    },
    setUserPhotos(state, action) {
      state.user.photos = action.payload;
    },
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
