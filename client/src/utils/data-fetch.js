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
    url: `${getServer()}/user/profile-picture`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ userID }),
  };

  const handleResponse = async (response) => {
    await store.dispatch(
      dataActions.setUserProfilePicture({
        userID,
        photoString: response.imageDataString,
      })
    );
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  await httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchPhotos = async (userID, setData) => {
  const requestConfig = {
    url: `${getServer()}/user/photos`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ userID }),
  };

  const handleResponse = (response) => {
    setData(response.photos);
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  await httpFetch(requestConfig, handleResponse, handleError);
};
