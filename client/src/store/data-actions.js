import store from ".";
import { fetchPhotos, fetchProfilePic } from "../utils/data-fetch";
import { dataActions } from "./data-slice";

export const initializeUserPhotos = (newOnly = true) => {
  // If newOnly is flagged,
  // Only download image data if is hasen't been downloaded
  const user = store.getState().auth.user;
  const dataStore = store.getState().data;
  const userData = dataStore.users[user._id];

  // Set profile picture zoom and crop from auth user
  function initCropZoom(userObject) {
    
    store.dispatch(
      dataActions.setUserZoom({
        userID: userObject._id,
        zoom: userObject.profile_picture.zoom,
      })
    );
    store.dispatch(
      dataActions.setUserCrop({
        userID: userObject._id,
        crop: userObject.profile_picture.crop,
      })
    );
  }

  initCropZoom(user);
  // Fetch user profile picture and photos
  if (newOnly && !userData) {
    fetchProfilePic(user._id);
    fetchPhotos(user);
  } else if (newOnly && !userData.photos[0]) {
    fetchPhotos(user);
  } else if (!newOnly) {
    fetchProfilePic(user._id);
    fetchPhotos(user);
  }

  // Fetch friend user profile pictures
  for (let friend of user.friends) {
    initCropZoom(friend);
    if (newOnly && !dataStore.users[friend]) {
      fetchProfilePic(friend._id);
    } else if (!newOnly) {
      fetchProfilePic(friend._id);
    }
  }
};
