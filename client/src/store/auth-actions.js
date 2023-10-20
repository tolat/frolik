import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";
import { getServer } from "../utils/env-utils";
import { modalActions } from "./modal-slice";
import { hideModal } from "./modal-actions";

// Create a login action to attempt to log in the user
export const fetchLogin = (username, password) => {
  // config for login post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = {
      url: `${getServer()}/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      method: 'POST',
      body: JSON.stringify({ username, password }),
    };

    const handleResponse = (response) => {
      dispatch(authActions.login(response));
    };

    const handleError = (err) => {
      if (err.message === "unauthorized") {
        // COULD ADD CODE HERE TO UPDATE AN "incorrect credentials" STATE
      }
      console.log(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};

// Create a check auth action to check if session is authenticated on page load
export const fetchAuth = () => {
  // config for auth check post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = { url: `${getServer()}/auth/check` };

    const handleResponse = (response) => {
      response.user
        ? dispatch(authActions.login(response))
        : dispatch(authActions.logout());
    };

    const handleError = (err) => {
      dispatch(authActions.logout());
      console.log(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};

export const fetchLogout = () => {
  // config for login post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = { url: `${getServer()}/auth/logout` };

    const handleResponse = (response) => {
      hideModal();
      dispatch(authActions.logout());
      setTimeout(() => {
        dispatch(authActions.deleteUser());
        dispatch(modalActions.setSelector("none"));
      }, 500);
    };

    const handleError = (err) => {
      throw new Error(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};
