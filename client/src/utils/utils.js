import { redirect } from "react-router-dom";
import store from "../store";
import { fetchAuth } from "../store/auth-actions";
import { hideModalFast } from "../store/modal-actions";
import { goActions } from "../store/go-slice";

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
};
