import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";
import { dataActions } from "../store/data-slice";
import store from "../store";
import { authActions } from "../store/auth-slice";

export const fetchActivities = async (setData) => {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: `${getServer()}/activity/get-all`,
    };

    const handleResponse = (response) => {
      setData(response.activities);
      resolve();
    };

    const handleError = (err) => {
      reject();
      throw new Error(err);
    };

    httpFetch(requestConfig, handleResponse, handleError);
  });
};

export const fetchProfilePic = async (userID) => {
  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-picture`,
  };

  const handleResponse = async (response) => {
    response.text().then((imageDataString) => {
      store.dispatch(
        dataActions.setUserProfilePicture({
          userID,
          photoString: imageDataString,
        })
      );
    });
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchPhotos = async (user) => {
  const userData = store.getState().data.users[user._id];
  for (let photoKey of user.photos) {
    // Check if photo has already been downloaded or queued
    if (!userData || !userData.photos.find((p) => p.key === photoKey)) {
      // Mark photo as queued for donwload in redux store
      store.dispatch(
        dataActions.queueUserPhoto({ userID: user._id, photoKey })
      );

      const requestConfig = {
        url: `${getServer()}/user/${user._id}/photo/${photoKey}`,
      };

      const handleResponse = async (response) => {
        response.text().then((imageDataString) => {
          store.dispatch(
            dataActions.addUserPhoto({
              userID: user._id,
              photoKey,
              photoString: imageDataString,
            })
          );
        });
      };

      const handleError = (err) => {
        throw new Error(err);
      };

      httpFetch(requestConfig, handleResponse, handleError);
    }
  }
};

export const uploadProfilePicture = async (userID) => {
  const userData = store.getState().data.users[userID];
  const user = store.getState().auth.user;
  // Only proceed if changes have been made to the profile picture data
  if (
    (userData && userData.profile_picture !== user.profile_picture) ||
    userData.zoom !== user.zoom ||
    userData.crop !== user.crop
  ) {
    const requestConfig = {
      url: `${getServer()}/user/${userID}/profile-picture`,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        photoString: userData.profile_picture,
        zoom: userData.zoom,
        crop: userData.crop,
        key: user.username,
      }),
    };

    const handleResponse = (response) => {
      store.dispatch(authActions.setUser(response.user));
      store.dispatch(authActions.setUserFriends(response.populatedFriends));
    };

    const handleError = (err) => {
      console.log(err);
    };

    httpFetch(requestConfig, handleResponse, handleError);
  }
};
