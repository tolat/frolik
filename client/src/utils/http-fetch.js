import store from "../store";
import { popupActions } from "../store/popup-slice";

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
      // Show warning popup with message if unacceptable (406)
      if (response.status === 406) {
        response.json().then((body) => {
          store.dispatch(popupActions.setWarningHeader(body.header));
          store.dispatch(popupActions.setWarningMessage(body.message));
          store.dispatch(popupActions.showPopup("generic-warning"));
          handleError(response);
        });
      } else {
        handleError(response);
      }
    } else {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return handleResponse(data);
      } else {
        return handleResponse(response);
      }
    }
  } catch (err) {
    return handleError(err);
  }
}
