import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";
import { dataActions } from "../store/data-slice";
import store from "../store";

export const fetchActivities = async (setData) => {
  const requestConfig = {
    url: `${getServer()}/activity/get-all`,
  };

  const handleResponse = (response) => {
    setData(response.activities);
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  await httpFetch(requestConfig, handleResponse, handleError);
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
  const dataStateUser = store.getState().data.users[user._id];
  for (let photoKey of user.photos) {
    // Check if photo has already been downloaded or queued
    if (
      !dataStateUser ||
      !dataStateUser.photos.find((p) => p.key === photoKey)
    ) {
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
