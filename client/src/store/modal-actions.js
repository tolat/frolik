import { modalActions } from "./modal-slice";
import store from ".";

const modalCleanup = () => {
  const dispatch = store.dispatch;
  dispatch(modalActions.setZIndex("-1"));
  dispatch(modalActions.setSelector(null));
  dispatch(modalActions.setActiveChat(false));
  dispatch(modalActions.setActiveOuting(false));
};

export const hideModal = () => {
  return new Promise((resolve) => {
    const dispatch = store.dispatch;

    dispatch(modalActions.hideModal());
    setTimeout(() => {
      modalCleanup();
      resolve(); // Resolve the promise when the setTimeout finishes
    }, 300);
  });
};

export const hideModalFast = () => {
  const dispatch = store.dispatch;
  dispatch(modalActions.setOpacity(0));
  dispatch(modalActions.hideModal());
  setTimeout(() => {
    modalCleanup();
    dispatch(modalActions.setOpacity("1"));
  }, 300);
};
