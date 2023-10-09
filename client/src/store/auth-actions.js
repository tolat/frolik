import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";
import { getServer } from "../utils/env-utils";
import { modalActions } from "./modal-slice";

// Create a login action to attempt to log in the user
export const fetchLogin = (username, password) => {
  // config for login post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = {
      url: `${getServer()}/auth/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    const handleResponse = (response) => {
      dispatch(authActions.login(response.user));
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

    const requestConfig = {
      url: `${getServer()}/auth/check`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    const handleResponse = (response) => {
      response.isAuthenticated
        ? dispatch(authActions.login(response.user))
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

    const requestConfig = {
      url: `${getServer()}/auth/logout`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    const handleResponse = (response) => {
      dispatch(modalActions.hideModal());
      dispatch(authActions.logout());
      setTimeout(() => {
        dispatch(authActions.deleteUser());
        dispatch(modalActions.setZIndex("-1"));
        dispatch(modalActions.setContent(null))
      }, 500);
    };

    const handleError = (err) => {
      throw new Error(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};
