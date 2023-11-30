import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {},
  masterPhotoDimension: 30,
  inviteOutings: [],
  cachedUsers: [],
  cachedPhotos: {},
  fetchingFeedOutings: false,
  creatingOuting: false
};

const findOrCreateUser = (state, action) => {
  if (!action.payload.userID) {
    //console.log("NO USERID PASSED TO DATASLICE");
  }

  // Create user objet in store if none exists
  if (!Object.keys(state.users).find((key) => key === action.payload.userID)) {
    state.users[action.payload.userID] = {
      profile_picture: false,
      zoom: 1,
      crop: { x: 0, y: 0 },
      photos: [],
    };
  }
  return state.users[action.payload.userID];
};

const dataSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setUserName(state, action) {
      const user = findOrCreateUser(state, action);
      user.first_name = action.payload.first_name;
      user.last_name = action.payload.last_name;
    },
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
    updateUserPhotoData(state, action) {
      const user = findOrCreateUser(state, action);
      const newImage = action.payload.data.profile_picture;
      const newCrop = action.payload.data.crop;
      const newZoom = action.payload.data.zoom;

      if (newImage) user.profile_picture = newImage;
      if (newCrop) user.crop = newCrop;
      if (newZoom) user.zoom = newZoom;
    },
    clearAllUserData(state) {
      state.users = initialState;
    },
    addInviteOuting(state, action) {
      state.inviteOutings.push(action.payload);
    },
    addCachedUser(state, action) {
      state.cachedUsers.push(action.payload);
    },
    addCachedPhoto(state, action) {
      state.cachedPhotos[action.payload.key] = action.payload.photoString;
    },
    queueCachedPhoto(state, action) {
      state.cachedPhotos[action.payload] = "queued";
    },
    setFetchingFeedOutings(state, action) {
      state.fetchingFeedOutings = action.payload;
    },
    setCreatingOuting(state, action) {
      state.creatingOuting = action.payload;
    },
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
