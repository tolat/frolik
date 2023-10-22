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

export const pageLoader = async () => {
  await fetchAuth()();
  hideModalFast();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  } else {
    // Set authenticated user as default for go page
    const user = store.getState().auth.user;
    if (!store.getState().go.outing.users.find((u) => u._id !== user._id))
      store.dispatch(goActions.setUsers([user]));
  }
  return false;
};

export const initializeUserMedia = async () => {
  const user = store.getState().auth.user;

  // Get user profile picture and photo thumbs
  if (!localStorage.getItem(`${user._id}-profile-picture`)) {
    await fetchProfilePic(user._id);
  }
  if (
    user.photos[0] &&
    !Object.keys(localStorage).find((key) => key.includes(`${user._id}-photo`))
  ) {
    await fetchPhotos(user._id);
  }

  // Get user friend profile pics
  for (let friend of user.friends) {
    const friendId = friend._id || friend;
    if (!localStorage.getItem(`${friendId}-profile-picture`)) {
      await fetchProfilePic(friendId);
    }
  }
};
