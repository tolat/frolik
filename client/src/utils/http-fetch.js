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
    });

    // Handle other status codes (e.g., 401, 500) here
    if (!response.ok) {
      if (response.status == 401) {
        throw new Error("unauthorized");
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } else {
      const data = await response.json();
      handleResponse(data);
    }
  } catch (err) {
    handleError(err);
  }
}
