import store from "../store";
import { authActions } from "../store/auth-slice";

export default async function httpFetch(
  requestConfig,
  handleResponse,
  handleError
) {
  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : "GET",
      headers: requestConfig.headers ? requestConfig.headers : {},
      body: requestConfig.body ? requestConfig.body : null,
      mode: requestConfig.mode ? requestConfig.mode : "cors",
      credentials: requestConfig.credentials
        ? requestConfig.credentials
        : "include",
    });

    // Handle other status codes (e.g., 401, 500) here
    if (!response.ok) {
      // Logout if unauthorized
      if (response.status === 401) {
        store.dispatch(authActions.logout());
        window.location = '/login'
      } else {
        handleError(response);
      }
    } else {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        handleResponse(data);
      } else {
        handleResponse(response);
      }
    }
  } catch (err) {
    handleError(err);
  }
}
