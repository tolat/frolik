import { removePushFromServer } from "../utils/push";
import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";
import { getServer } from "../utils/env-utils";
import { dataActions } from "./data-slice";
import { initializeUserPhotos } from "./data-actions";
import { fetchChats } from "../utils/data-fetch";
import { setBadge } from "../utils/badge";
import { syncUserLanguage } from "../i18n";

// Send request to log the user in and start a session in the browser
export const fetchLogin = (username, password, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/auth/login`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, password }),
  };

  const handleResponse = (response) => {
    response.user.friends = response.populatedFriends;
    store.dispatch(authActions.login(response));
    syncUserLanguage(response.user);
    initializeUserPhotos(response.user);
    fetchChats(response.user);
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// The session check in flight, shared by everyone who asks while it runs
// (a second caller used to get an instant, empty resolve)
let authInFlight = null;
// Whether a session check has finished at least once since the app loaded
let authCheckedOnce = false;
export const authChecked = () => authCheckedOnce;

export const fetchAuth = () => {
  if (authInFlight) return authInFlight;
  authInFlight = runFetchAuth().finally(() => {
    authInFlight = null;
    authCheckedOnce = true;
  });
  return authInFlight;
};

const runFetchAuth = () => {
  return new Promise((resolve, reject) => {
    const dispatch = store.dispatch;

    const requestConfig = { url: `${getServer()}/auth/check` };

    const handleResponse = (response) => {
      store.dispatch(authActions.setFetchingAuth(false));

      // If session is authenticated, dispatch login to state
      if (response.user) {
        response.user.friends = response.populatedFriends;
        initializeUserPhotos(response.user);
        fetchChats(response.user);
        dispatch(authActions.login(response));
        syncUserLanguage(response.user);
      }

      resolve()
    };

    const handleError = (err) => {
      store.dispatch(authActions.setFetchingAuth(false));

      // Only the server saying "not signed in" logs you out. A failed request
      // (no signal, server restarting) used to log you out too, dropping you
      // on the login screen mid-use.
      if (err?.status === 401 || err?.status === 403) {
        dispatch(authActions.logout());
        if (err.status === 401) window.location = "/login";
      }

      // Resolve (not reject) so route loaders don't crash to the error page
      resolve();
      return null;
    };

    try {
      store.dispatch(authActions.setFetchingAuth(true));
      return httpFetch(requestConfig, handleResponse, handleError);
    } catch (err) {
      store.dispatch(authActions.setFetchingAuth(false));
      console.log(err);
      resolve(); // never leave a waiting page loader hanging
    }
  });
};

export const fetchLogout = async () => {
  const dispatch = store.dispatch;

  // Stop this device receiving the account's notifications
  await removePushFromServer();
  try {
    sessionStorage.removeItem("returnTo"); // next login starts on Outing
  } catch {}

  const requestConfig = { url: `${getServer()}/auth/logout` };

  const handleResponse = () => {
    window.location = "/login";
    dispatch(authActions.logout());
    setTimeout(() => {
      setBadge(0)
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
