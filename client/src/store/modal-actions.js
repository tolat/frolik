import { modalActions } from "./modal-slice";
import store from ".";

export const hideModal = () => {
  const dispatch = store.dispatch;
  dispatch(modalActions.hideModal());
  setTimeout(() => {
    dispatch(modalActions.setZIndex("-1"));
  }, 300);
};
