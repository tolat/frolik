import { redirect } from "react-router-dom";
import store from "../store";
import { fetchAuth } from "../store/auth-actions";
import { hideModal } from "../store/modal-actions";
import { goActions } from "../store/go-slice";

export const calcAvgRating = (activity) => {
  return (
    activity.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    activity.ratings.length
  );
};

export const pageLoader = async () => {
  fetchAuth();
  if (store.getState().modal.marginLeft === "0%") await hideModal();

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

export const arrayBufferToBase64 = (buffer) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
