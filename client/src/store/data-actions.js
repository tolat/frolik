import store from ".";
import { fetchPhotos, fetchProfilePic } from "../utils/data-fetch";
import { dataActions } from "./data-slice";

export const initializeUserPhotos = (user, newOnly = true) => {
  // If newOnly is flagged,
  // Only download image data if is hasen't been downloaded
  const dataStore = store.getState().data;
  const userData = dataStore.users[user._id];

  // Set profile picture zoom and crop from auth user
  function initCropZoom(userObject) {
    store.dispatch(
      dataActions.setUserZoom({
        userID: userObject?._id,
        zoom: userObject?.profile_picture?.zoom,
      })
    );
    store.dispatch(
      dataActions.setUserCrop({
        userID: userObject?._id,
        crop: userObject?.profile_picture?.crop,
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

  // Fetch all related user profile pictures
  // including all user friends, outing members and outing invitees
  const allOutingUsers = user.outings
    .map((o) => o.users)
    ?.reduce((acc, curr) => acc.concat(curr), []);
  const allOutingInvited = user.outings
    .map((o) => o.invited)
    ?.reduce((acc, curr) => acc.concat(curr), []);

  const allRelatedUsers = user.friends
    .concat(allOutingUsers)
    .concat(allOutingInvited);
  for (let relatedUser of allRelatedUsers) {
    initCropZoom(relatedUser);
    if (newOnly && !dataStore.users[relatedUser]) {
      fetchProfilePic(relatedUser._id);
    } else if (!newOnly) {
      fetchProfilePic(relatedUser._id);
    }
  }
};
