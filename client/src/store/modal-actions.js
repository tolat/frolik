import { modalActions } from "./modal-slice";
import store from ".";

export const hideModal = () => {
  return new Promise((resolve) => {
    const dispatch = store.dispatch;
    
    dispatch(modalActions.hideModal());

    setTimeout(() => {
      dispatch(modalActions.setZIndex("-1"));
      dispatch(modalActions.setSelector(null))
      resolve(); // Resolve the promise when the setTimeout finishes
    }, 300);
  });
};

export const hideModalFast = () => {
  const dispatch = store.dispatch;
  dispatch(modalActions.setOpacity(0));
  dispatch(modalActions.hideModal());
  setTimeout(() => {
    dispatch(modalActions.setZIndex("-1"));
    dispatch(modalActions.setOpacity("1"));
  }, 300);
};
