import { redirect } from "react-router-dom";
import store from "../store";
import { fetchAuth } from "../store/auth-actions";
import { hideModalFast } from "../store/modal-actions";
import { goActions } from "../store/go-slice";
import { fetchPhotos, fetchProfilePic } from "./data-fetch";

export const calcAvgRating = (activity) => {
  return (
    activity.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    activity.ratings.length
  );
};

export const pageLoader =  () => {
  fetchAuth()();
  hideModalFast();

  if (!store.getState().auth.isAuthenticated) {
    console.log("going ot login")
    return redirect("/login");
  } else {
    // Set authenticated user as default for go page
    const user = store.getState().auth.user;
    if (!store.getState().go.outing.users.find((u) => u._id !== user._id))
      store.dispatch(goActions.setUsers([user]));

      initializeUserMedia()
  }
  return false;
};

export const initializeUserMedia = async (newOnly = true) => {
  // if newOnly is flagged,
  // Only download image data if is hasen't been downloaded
  const dataStore = store.getState().data;
  const user = store.getState().auth.user;
  if (newOnly && !dataStore.users[user._id]) {
    fetchProfilePic(user._id);
    fetchPhotos(user);
  } else if (newOnly && !dataStore.users[user._id].photos[0]) {
    fetchPhotos(user);
  } else if (!newOnly) {
    fetchProfilePic(user._id)
    fetchPhotos(user);
  }

  for (let friend of user.friends) {
    if (newOnly && !dataStore.users[friend._id || friend]) {
      fetchProfilePic(friend._id || friend);
    } else if (!newOnly) {
      fetchProfilePic(friend._id || friend);
    }
  }
};

