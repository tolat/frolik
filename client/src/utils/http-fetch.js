import store from "../store";
import { popupActions } from "../store/popup-slice";
import { socketActions } from "../store/socket-slice";
import { getLanguage, t } from "../i18n";

export default async function httpFetch(
  requestConfig,
  handleResponse,
  handleError
) {
  try {
    store.dispatch(socketActions.setIsConnecting(true));
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method ? requestConfig.method : "GET",
      // The server answers errors (and signed-out screens) in this language
      headers: { "X-Frolik-Lang": getLanguage(), ...(requestConfig.headers || {}) },
      body: requestConfig.body ? requestConfig.body : null,
      mode: requestConfig.mode ? requestConfig.mode : "cors",
      credentials: requestConfig.credentials
        ? requestConfig.credentials
        : "include",
    });

    // Set Loading bar to hidden
    store.dispatch(socketActions.setIsConnecting(false));

    // Handle other status codes (e.g., 401, 500) here
    if (!response.ok) {
      // Show warning popup with message if unacceptable (406)
      if (response.status === 406) {
        response.json().then((body) => {
          store.dispatch(popupActions.setWarningHeader(body.header));
          store.dispatch(popupActions.setWarningMessage(body.message));
          // e.g. "Email Verification Required" offers to resend the link
          store.dispatch(
            popupActions.setWarningAction(
              body.action ? { type: body.action, email: body.email } : null
            )
          );
          store.dispatch(popupActions.showPopup("generic-warning"));

          handleError(response);
        });
      } else if (response.status === 500) {
        const message = t("common.errors.serverMessage");
        store.dispatch(popupActions.setWarningHeader(t("common.errors.serverHeader")));
        store.dispatch(popupActions.setWarningMessage(message));
        store.dispatch(popupActions.showPopup("generic-warning"));
        handleError(response);
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
