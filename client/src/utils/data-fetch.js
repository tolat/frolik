import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";
import { dataActions } from "../store/data-slice";
import store from "../store";
import { authActions } from "../store/auth-slice";
import { chatActions } from "../store/chat-slice";
import { goActions } from "../store/go-slice";

// Get all activities
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

// Get user's profile picture and update redux store
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
    response.text().then((imgUrl) => {
      store.dispatch(
        dataActions.setUserProfilePicture({
          userID,
          photoString: imgUrl,
        })
      );
    });
  };

  const handleError = (err) => {
    console.log(err);
  };

  store.dispatch(
    dataActions.setUserProfilePicture({ userID, photoString: "queued" })
  );
  httpFetch(requestConfig, handleResponse, handleError);
};

// Get all photos from user outings
export const fetchPhotos = async (user) => {
  const userData = store.getState().data.users[user._id];

  // Create array of photo keys from user outings
  let photoKeys = [];
  for (let outing of user.outings) {
    for (let photoKey of outing.photos.map((p) => p.key)) {
      photoKeys.push(photoKey);
    }
  }
  for (let photoKey of photoKeys) {
    // Check if photo has already been downloaded or queued
    if (
      !userData ||
      !userData.photos.find((p) => p.key === photoKey && p.photo)
    ) {
      // Mark photo as queued for donwload in redux store
      store.dispatch(
        dataActions.queueUserPhoto({ userID: user._id, photoKey })
      );

      const requestConfig = {
        url: `${getServer()}/user/${user._id}/photo/${photoKey}`,
      };

      const handleResponse = async (response) => {
        response.text().then((imgUrl) => {
          store.dispatch(
            dataActions.addUserPhoto({
              userID: user._id,
              photoKey,
              photoString: imgUrl,
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

// Get the app globals
export const fetchGlobals = async () => {
  // Don;t fetch if globals are already being fetched
  if (store.getState().auth.fetchingGlobals) {
    return;
  }
  const requestConfig = {
    url: `${getServer()}/data/globals`,
  };

  const handleResponse = async (response) => {
    store.dispatch(authActions.setUpdatingGlobals(false));
    store.dispatch(authActions.setGlobals(response.globals));
  };

  const handleError = (err) => {
    store.dispatch(authActions.setUpdatingGlobals(false));
    console.log(err);
  };

  store.dispatch(authActions.setUpdatingGlobals(true));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Update all the non-photo data for a user
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

  if (store.getState().auth.fetchingMatchedUsers) {
    return;
  }

  const handleResponse = (response) => {
    store.dispatch(authActions.setFetchingMatchedUsers(false));
    setMatchedUsers(response.matches);
    for (user of response.matches) {
      fetchProfilePic(user._id);
    }
  };

  const handleError = (err) => {
    store.dispatch(authActions.setFetchingMatchedUsers(false));
    console.log("ERROR: ", err);
  };

  store.dispatch(authActions.setFetchingMatchedUsers(true));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Get a chat with given id from server
export const fetchChat = (userID, chatID, onComplete = () => {}) => {
  if (!userID || !chatID) return;
  const requestConfig = { url: `${getServer()}/user/${userID}/chat/${chatID}` };

  const handleResponse = (response) => {
    const populatedUsers = response.populatedUsers;
    if (response.chat.outing) {
      response.chat.outing.users = populatedUsers;
    } else {
      response.chat.users = populatedUsers;
    }

    // Get any missing user photos
    for (let user of populatedUsers) {
      if (!store.getState().data.users[user._id]) {
        fetchProfilePic(user._id);
      }
    }

    // Set chats in data store
    store.dispatch(chatActions.updateChat(response.chat));

    onComplete();
  };

  const handleError = (err) => {
    console.log("ERROR: ", err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Get all chats for a user
export const fetchChats = (user) => {
  const dispatch = store.dispatch;

  // Don;t fetch if chats are already being fetched
  if (store.getState().chat.fetchingChats) {
    return;
  }

  const requestConfig = { url: `${getServer()}/user/${user._id}/chats` };

  const handleResponse = (response) => {
    dispatch(chatActions.setFetchingChats(false));
    // Insert populated members lists from response for each chat
    for (let chat of response.chats) {
      if (chat.outing) {
        chat.outing.users = response.chatMembersMap[chat._id];
      } else {
        chat.users = response.chatMembersMap[chat._id];
      }

      // Get any missing user photos
      const chatUsers = chat.outing ? chat.outing.users : chat.users;
      for (let member of chatUsers) {
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
    dispatch(chatActions.setFetchingChats(false));
    console.log(err);
  };

  dispatch(chatActions.setFetchingChats(true));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Create a new outing
export const createOuting = (outing, user, setOutingData, resetButton) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/create-outing`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(outing),
  };

  if (store.getState().data.creatingOuting) {
    return;
  }

  const handleResponse = (response) => {
    store.dispatch(dataActions.setCreatingOuting(false));
    response.user.friends = response.populatedFriends;
    // Update user in redux store
    store.dispatch(authActions.setUser(response.user));

    // Reset outing in gostate
    setTimeout(() => {
      store.dispatch(goActions.reset([user]));
    }, 1000);

    // Set data
    setOutingData(response.outing);
  };

  const handleError = (err) => {
    resetButton();
    store.dispatch(dataActions.setCreatingOuting(false));
    console.log(err);
  };

  store.dispatch(dataActions.setCreatingOuting(true));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Get one outing
export const fetchOuting = (outingID, user, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outingID}`,
  };

  const handleResponse = (response) => {
    onComplete(response.outing);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Joing an Outing
export const joinOuting = (user, outing, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/join`,
  };

  const handleResponse = (response) => {
    const newUser = { ...response.user, friends: user.friends };
    onComplete(newUser, response.outing);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// leave an Outing
export const leaveOuting = (user, outing, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/leave`,
  };

  const handleResponse = (response) => {
    const newUser = { ...response.user, friends: user.friends };
    onComplete(newUser);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Delete an Outing
export const deleteOuting = (user, outing, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/delete`,
  };

  const handleResponse = (response) => {
    const newUser = { ...response.user, friends: user.friends };
    onComplete(newUser);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Dismiss a notification
export const dismissNotification = (user, notification, onComplete, status) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/notification/${
      notification.id
    }/dismiss`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ status }),
  };

  const handleResponse = (response) => {
    const newUser = { ...response.user, friends: user.friends };
    onComplete(newUser);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Fetch a user with stripped down data
export const fetchStrippedUser = (userID, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/stripped-user/${userID}`,
  };

  const handleResponse = (response) => {
    onComplete(response.user);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Upload a photo to an outing
export const uploadOutingPhoto = (
  user,
  outing,
  photoString,
  onComplete = () => {}
) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/upload-photo`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ photoString }),
  };

  const handleResponse = (response) => {
    fetchPhotos(store.getState().auth.user);
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Delete a photo from an outing
export const deleteOutingPhoto = (user, outing, key, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/delete-photo`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ key }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Add a user to an Outing's completion list
export const addOutingCompletion = (
  user,
  outing,
  rating,
  onComplete = () => {}
) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/outing/${outing._id}/add-completion`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ rating }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Send a new friend request to another user
export const sendFriendRequest = (user, friend, onComplete = () => {}) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/add-friend`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ friendID: friend._id }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Remove a friend
export const removeFriend = (user, friend, onComplete = () => {}) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/remove-friend`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ friendID: friend._id }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Create a new Chat
export const createChat = (user, withUsers, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/chat/create`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ withUsers }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

// Update this user's last read message for a chat
export const updateChatLastRead = (user, chat, messageID, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/chat/${chat._id}/update-last-read`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ messageID }),
  };

  if (store.getState().chat.updatingLastRead === messageID) {
    return;
  }

  const handleResponse = (response) => {
    onComplete(response);
    store.dispatch(chatActions.setUpdatingLastRead(false));
  };

  const handleError = (err) => {
    store.dispatch(chatActions.setUpdatingLastRead(false));
    console.log(err);
  };

  store.dispatch(chatActions.setUpdatingLastRead(messageID));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Fetch the outings for this user's social feed
export const fetchFeedOutings = (user, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/feed-outings`,
  };

  if (store.getState().data.fetchingFeedOutings) {
    return;
  }

  const handleResponse = (response) => {
    store.dispatch(dataActions.setFetchingFeedOutings(false));
    onComplete(response);
  };

  const handleError = (err) => {
    store.dispatch(dataActions.setFetchingFeedOutings(false));
    console.log(err);
  };

  store.dispatch(dataActions.setFetchingFeedOutings(true));
  httpFetch(requestConfig, handleResponse, handleError);
};

// Get a photo from an outing
export const fetchOutingPhoto = (outing, key, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/data/outing/${outing._id}/photo/${key}`,
  };

  // Don't fetch cached photos more than once
  const state = store.getState();
  if (
    state.data.cachedPhotos[key] ||
    state.data.users[state.auth.user._id].photos.find((p) => p.key === key)
  ) {
    return;
  }

  const handleResponse = (response) => {
    response.text().then((imageUrl) => {
      onComplete(imageUrl);
    });
  };

  const handleError = (err) => {
    console.log(err);
  };

  store.dispatch(dataActions.queueCachedPhoto(key));
  httpFetch(requestConfig, handleResponse, handleError);
};

export const sendResetLink = (username, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/auth/send-reset-link`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const resetPassword = (userID, password, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/auth/reset-password`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ userID, password }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const resendVerificationEmail = (username, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/auth/resend-verification-email`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const createActivity = (user, activity, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/activity/create`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ activity, userID: user._id }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const deleteActivity = (user, activity, onComplete = () => {}) => {
  const requestConfig = {
    url: `${getServer()}/activity/delete`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ activity, userID: user._id }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const setUserLike = (user, outing, liked, onComplete) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/set-like`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ outingID: outing._id, liked }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchPushTest = (userID, onComplete = () => {}) => {
  const requestConfig = {
    url: `${getServer()}/notifications/push/test`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ userID }),
  };

  const handleResponse = (response) => {
    onComplete(response);
  };

  const handleError = (err) => {
    onComplete(err);
    console.log(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};
