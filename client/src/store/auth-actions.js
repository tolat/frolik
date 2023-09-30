import httpFetch from "../utils/http-fetch";
import { authActions } from "./auth-slice";
import store from ".";

// Create a login action to attempt to log in the user
export const login = (username, password) => {
  // config for login post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = {
      url: `http://localhost:3001/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    // handle login post request response
    const handleResponse = (response) => {
      dispatch(authActions.login(response.userID));
    };

    // handle login post request errors
    const handleError = (err) => {
    if(err.message === 'unauthorized'){
        // COULD ADD CODE HERE TO UPDATE AN "incorrect credentials" STATE
    }
      console.log(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};

// Create a check auth action to check if session is authenticated on page load
export const checkAuth = () => {
  // config for auth check post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = {
      url: `http://localhost:3001/check-auth`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    // handle auth check post request response
    const handleResponse = (response) => {
      response.isAuthenticated
        ? dispatch(authActions.login(response.userID))
        : dispatch(authActions.logout());
    };

    // handle auth check post request errors
    const handleError = (err) => {
      dispatch(authActions.logout());
      console.log(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};

export const logout = () => {
  // config for login post request
  return async (dispatch) => {
    // If dispatch is undefined (this funciton is called from outside a component),
    // use the dispatch method on the store object
    dispatch = dispatch ? dispatch : (dispatch = store.dispatch);

    const requestConfig = {
      url: `http://localhost:3001/logout`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    // handle logout post request response
    const handleResponse = (response) => {
      dispatch(authActions.logout());
    };

    // handle logout post request errors
    const handleError = (err) => {
      console.log(err);
    };

    await httpFetch(requestConfig, handleResponse, handleError);
  };
};
