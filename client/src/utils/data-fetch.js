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
      console.log(err);
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
    console.log(err);
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
        console.log(err);
      };

      httpFetch(requestConfig, handleResponse, handleError);
    }
  }
};

export const fetchGobals = async (setGlobals) => {
  const requestConfig = {
    url: `${getServer()}/data/globals`,
  };

  const handleResponse = async (response) => {
    setGlobals(response.globals);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const uploadProfilePictureData = async (userID, data) => {
  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-picture`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  };

  const handleResponse = (response) => {
    store.dispatch(authActions.setUser(response.user));
    store.dispatch(authActions.setUserFriends(response.populatedFriends));
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const uploadProfileData = (userID, data, resetData) => {
  const userProfilePictureKey = store.getState().auth.user.profile_picture.key;

  const profilePictureData = {
    photoString: data.image,
    zoom: data.zoom,
    crop: data.crop,
    key: userProfilePictureKey,
  };

  const profileData = {
    first_name: data.first_name,
    last_name: data.last_name,
    location: data.location,
    tagline: data.tagline,
    status: data.status,
  };

  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-data`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(profileData),
  };

  const handleResponse = (response) => {
    // Update user in redux store
    store.dispatch(authActions.setUser(response.user));

    // Upload profile picture data once user data has been updated
    uploadProfilePictureData(userID, profilePictureData);

    // Reset data
    resetData();
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};
