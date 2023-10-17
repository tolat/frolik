import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";

export const fetchActivities = async (setData) => {
  const requestConfig = {
    url: `${getServer()}/activity/get-all`,
  };

  const handleResponse = (response) => {
    setData(response.activities);
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  await httpFetch(requestConfig, handleResponse, handleError);
};
