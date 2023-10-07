import httpFetch from "./http-fetch"
import { getServer } from "./env-utils";

export const fetchUserFriendData = async (userID, setData) =>{
 
    const requestConfig = {
      url: `${getServer()}/user/friend`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userID}),
    };

    const handleResponse = (response) => {
        setData(response.friendData)
    };

    const handleError = (err) => {
      throw new Error(err);
    };

    return await httpFetch(requestConfig, handleResponse, handleError);
}