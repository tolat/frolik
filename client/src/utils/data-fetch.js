import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";
import { dataActions } from "../store/data-slice";
import store from "../store";
import { authActions } from "../store/auth-slice";
import { chatActions } from "../store/chat-slice";

export const fetchActivities = async (setData) => {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      url: `${getServer()}/activity/get-all`,
    };

    const handleResponse = (response) => {
      setData(response.activities);
      resolve();
    };

    const handleError = (err) => {
      console.log(err);
    };

    httpFetch(requestConfig, handleResponse, handleError);
  });
};

export const fetchProfilePic = async (userID) => {
  const userData = store.getState().data.users[userID];
  // Don't fetch if photo has been downloaded
  if (userData && userData.profile_picture) {
    return;
  }

  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-picture`,
  };

  const handleResponse = async (response) => {
    response.text().then((imageDataString) => {
      if (
        !userData ||
        (userData && userData.profile_picture !== imageDataString)
      ) {
        store.dispatch(
          dataActions.setUserProfilePicture({
            userID,
            photoString: imageDataString,
          })
        );
      }
    });
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchPhotos = async (user) => {
  const userData = store.getState().data.users[user._id];

  // Create array of photo keys from user outings
  let photoKeys = [];
  for (let outing of user.outings) {
    for (let photoKey of outing.photos) {
      photoKeys.push(photoKey);
    }
  }
  for (let photoKey of photoKeys) {
    // Check if photo has already been downloaded or queued
    if (!userData || !userData.photos.find((p) => p.key === photoKey)) {
      // Mark photo as queued for donwload in redux store
      store.dispatch(
        dataActions.queueUserPhoto({ userID: user._id, photoKey })
      );

      const requestConfig = {
        url: `${getServer()}/user/${user._id}/photo/${photoKey}`,
      };

      const handleResponse = async (response) => {
        response.text().then((imageDataString) => {
          store.dispatch(
            dataActions.addUserPhoto({
              userID: user._id,
              photoKey,
              photoString: imageDataString,
            })
          );
        });
      };

      const handleError = (err) => {
        console.log(err);
      };

      httpFetch(requestConfig, handleResponse, handleError);
    }
  }
};

export const fetchGobals = async () => {
  const requestConfig = {
    url: `${getServer()}/data/globals`,
  };

  const handleResponse = async (response) => {
    store.dispatch(authActions.setGlobals(response.globals));
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const uploadProfileData = (userID, data, resetForm) => {
  const photoString = data.profile_picture;
  const profileData = {
    first_name: data.first_name,
    last_name: data.last_name,
    location: data.location,
    tagline: data.tagline,
    status: { status: data.status, updated: Date.now() },
    profile_picture: {
      zoom: data.zoom,
      crop: data.crop,
      key: store.getState().auth.user.profile_picture.key,
    },
  };

  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-data`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ profileData, photoString }),
  };

  const handleResponse = (response) => {
    // Update user in redux store
    response.user.friends = response.populatedFriends;
    const user = response.user;
    const userID = user._id;

    // Update user data in the store
    store.dispatch(dataActions.setUserCrop({ userID, crop: data.crop }));
    store.dispatch(dataActions.setUserZoom({ userID, zoom: data.zoom }));
    store.dispatch(dataActions.setUserProfilePicture({ userID, photoString }));
    store.dispatch(authActions.setUser(user));

    resetForm();
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Send request to create a new user to the server
export const createAccount = (data, resetForm) => {
  const newUserData = {
    user: {
      first_name: data.first_name,
      last_name: data.last_name,
      location: data.location,
      tagline: data.tagline,
      profile_picture: {
        zoom: data.zoom,
        crop: data.crop,
        key: data.username,
      },
      photos: [],
      friends: [],
      flake: 0,
      username: data.username,
      password: data.password,
    },
    photoString: data.profile_picture,
  };

  const requestConfig = {
    url: `${getServer()}/user/create`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newUserData),
  };

  const handleResponse = (response) => {
    resetForm();
  };

  const handleError = (err) => {
    resetForm(err);
    console.log("ERROR: ", err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Fetch users matched with current user for creating outings
export const fetchMatchedUsers = (user, setMatchedUsers) => {
  const requestConfig = { url: `${getServer()}/user/${user._id}/matches` };

  const handleResponse = (response) => {
    setMatchedUsers(response.matches);
    for (user of response.matches) {
      fetchProfilePic(user._id);
    }
  };

  const handleError = (err) => {
    console.log("ERROR: ", err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Get chat from server
export const fetchChat = (userID, chatID) => {
  if (!userID || !chatID) return;
  const requestConfig = { url: `${getServer()}/user/${userID}/chat/${chatID}` };

  const handleResponse = (response) => {
    const populatedUsers = response.populatedUsers;
    response.chat.outing.users = populatedUsers;

    // Get any missing user photos
    for (let user of populatedUsers) {
      fetchProfilePic(user._id);
    }

    // Set chats in data store
    store.dispatch(chatActions.updateChat({ chat: response.chat }));
  };

  const handleError = (err) => {
    console.log("ERROR: ", err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchChats = (user) => {
  const dispatch = store.dispatch;

  const requestConfig = { url: `${getServer()}/user/${user._id}/chats` };

  const handleResponse = (response) => {
    // Insert populated members lists from response for each chat
    for (let chat of response.chats) {
      chat.outing.users = response.chatMembersMap[chat._id];
      // Get any missing user photos
      for (let member of chat.outing.users) {
        fetchProfilePic(member._id);
        store.dispatch(
          dataActions.setUserName({
            userID: member._id,
            first_name: member.first_name,
            last_name: member.last_name,
          })
        );
      }
    }

    // Set chats in data store
    dispatch(chatActions.setChats({ chats: response.chats }));
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};
