import { modalActions } from "./modal-slice";
import store from ".";

const modalCleanup = (setUsePrevious) => {
  const dispatch = store.dispatch;
  dispatch(modalActions.setZIndex("-1"));
  const usePrevious = store.getState().modal.usePrevious;

  if (usePrevious) {
    const previousModal = store.getState().modal.previousModal;
    dispatch(modalActions.setSelector(previousModal.selector));
    dispatch(modalActions.setActiveChat(previousModal.activeChat));
    dispatch(modalActions.setActiveOuting(previousModal.activeOuting));
    dispatch(modalActions.setHeaderStyle(previousModal.headerStyle));
    dispatch(modalActions.showModal());
    dispatch(modalActions.setUsePrevious(false));
  } else {
    dispatch(modalActions.setSelector("none"));
    dispatch(modalActions.setActiveChat(false));
    dispatch(modalActions.setActiveOuting(false));

    if (setUsePrevious) {
      dispatch(modalActions.setUsePrevious(true));
    }
  }
};

export const hideModal = (setUsePrevious = false) => {
  document.getElementById("main-container-children").style.opacity = 1;
  document.getElementById("main-container-children").style.height = null;
  document.getElementById("main-container-children").style.overflowY = null;

  return new Promise((resolve) => {
    const dispatch = store.dispatch;

    dispatch(modalActions.hideModal());
    setTimeout(() => {
      modalCleanup(setUsePrevious);
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
