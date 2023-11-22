import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";
import { getServer } from "../utils/env-utils";
import { dataActions } from "./data-slice";
import { initializeUserPhotos } from "./data-actions";
import { fetchChats } from "../utils/data-fetch";

// Send request to log the user in and start a session in the browser
export const fetchLogin = (username, password, setData) => {
  const requestConfig = {
    url: `${getServer()}/auth/login`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, password }),
  };

  const handleResponse = (response) => {
    console.log(response)
    response.user.friends = response.populatedFriends;
    store.dispatch(authActions.login(response));
    initializeUserPhotos(response.user);
    fetchChats(response.user);
    setData(false);
  };

  const handleError = (err) => {
    setData(false);
    console.log(err, err.status);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchAuth = (onComplete = () => {}) => {
  const dispatch = store.dispatch;

  // return if already fetching auth
  if (store.getState().auth.fetchingAuth) return;

  const requestConfig = { url: `${getServer()}/auth/check` };

  // If session is authenticated, dispatch login to state
  const handleResponse = (response) => {
    store.dispatch(authActions.setFetchingAuth(false));

    if (response.user) {
      response.user.friends = response.populatedFriends;
      initializeUserPhotos(response.user);
      fetchChats(response.user);
      dispatch(authActions.login(response));
    }

    return onComplete(response);
  };

  const handleError = (err) => {
    store.dispatch(authActions.setFetchingAuth(false));

    console.log("ERROR: ", err);
    err.text().then(data=>console.log(data))
    dispatch(authActions.logout());

    return null
  };

  try {
    store.dispatch(authActions.setFetchingAuth(true));
    return httpFetch(requestConfig, handleResponse, handleError);
  } catch (err) {
    store.dispatch(authActions.setFetchingAuth(false));
    console.log(err);
  }
};

export const fetchLogout = () => {
  const dispatch = store.dispatch;

  const requestConfig = { url: `${getServer()}/auth/logout` };

  const handleResponse = () => {
    window.location = "/login";
    dispatch(authActions.logout());
    setTimeout(() => {
      dispatch(dataActions.setUserProfilePicture(false));
      dispatch(dataActions.setUserPhotos([]));
      dispatch(authActions.deleteUser());
      dispatch(dataActions.clearAllUserData());
    }, 500);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};
