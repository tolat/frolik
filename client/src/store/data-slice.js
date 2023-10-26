import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {},
};

const findOrCreateUser = (state, action) => {
  // Create user objet in store if none exists
  if (!Object.keys(state.users).find((key) => key === action.payload.userID)) {
    state.users[action.payload.userID] = {
      profile_picture: false,
      zoom: 1,
      crop: { x: 0, y: 0 },
      photos: [],
      staged: {},
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
    setUserZoom(state, action) {
      const user = findOrCreateUser(state, action);
      user.zoom = action.payload.zoom;
    },
    setUserCrop(state, action) {
      const user = findOrCreateUser(state, action);
      user.crop = action.payload.crop;
    },
    setUserPhotos(state, action) {
      const user = findOrCreateUser(state, action);
      user.photos = action.payload.stringsArray;
    },
    addUserPhoto(state, action) {
      const user = findOrCreateUser(state, action);
      const photo = user.photos.find((p) => p.key === action.payload.photoKey);
      photo.photo = action.payload.photoString;
    },
    queueUserPhoto(state, action) {
      const user = findOrCreateUser(state, action);
      user.photos.push({
        key: action.payload.photoKey,
        photo: false,
      });
    },
    stageUserProfilePicture(state, action) {
      const user = findOrCreateUser(state, action);
      user.staged.profile_picture = action.payload.photoString;
    },
    stageUserCrop(state, action) {
      const user = findOrCreateUser(state, action);
      user.staged.crop = action.payload.crop;
    },
    stageUserZoom(state, action) {
      const user = findOrCreateUser(state, action);
      user.staged.zoom = action.payload.zoom;
    },
    clearStagedPhotoData(state, action) {
      const user = findOrCreateUser(state, action);
      user.staged = {};
    },
    commitStagedPhotoData(state, action) {
      const user = findOrCreateUser(state, action);
      // Check if anything has been staged before updating
      if (Object.keys(user.staged)[0]) {
        user.profile_picture = user.staged.profile_picture;
        user.zoom = user.staged.zoom;
        user.crop = user.staged.crop;
        user.staged = {};
      }
    },
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
