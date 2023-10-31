import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";
import { getServer } from "../utils/env-utils";
import { dataActions } from "./data-slice";

export const fetchLogin = (username, password, setIsLoggingIn) => {
  const dispatch = store.dispatch;

  console.log(username, password);

  const requestConfig = {
    url: `${getServer()}/auth/login`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, password }),
  };

  const handleResponse = (response) => {
    dispatch(authActions.login(response));
    setIsLoggingIn(false);
  };

  const handleError = (err) => {
    if (err.message === "unauthorized") {
      // COULD ADD CODE HERE TO UPDATE AN "incorrect credentials" STATE
    }
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchAuth = () => {
  const dispatch = store.dispatch;

  const requestConfig = { url: `${getServer()}/auth/check` };

  // If session is authenticated, dispatch login to state
  const handleResponse = (authData) => {
    if (authData.user) dispatch(authActions.login(authData));
  };

  const handleError = (err) => {
    dispatch(authActions.logout());
  };

  try {
    httpFetch(requestConfig, handleResponse, handleError);
  } catch (err) {
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
