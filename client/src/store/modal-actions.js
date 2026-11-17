import { setPageScrollLocked } from "../utils/pageScroll";
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
  document.getElementById("main-container-children").style.overflowY = null;
  setPageScrollLocked(false);

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

const scrollModalToTop = () => {
  const outer = document.getElementById("modal-container")?.parentElement;
  if (outer) outer.scrollTop = 0;
};

// Open a panel on top of the currently open one *in place* (no slide out and
// back in). `open` dispatches the new selector/state. The Back button then
// returns straight to the panel underneath (see modalBack).
export const swapModal = (open) => {
  const state = store.getState().modal;
  const isOpen = state.marginLeft === "0%" && state.selector !== "none";
  if (isOpen) store.dispatch(modalActions.setUsePrevious(true));
  open();
  if (isOpen) scrollModalToTop();
};

// Back button: go back to the panel this one was opened from, in place;
// otherwise close the panel as usual.
export const modalBack = () => {
  const state = store.getState().modal;
  const prev = state.previousModal;
  if (state.usePrevious && prev?.selector && prev.selector !== "none") {
    const dispatch = store.dispatch;
    dispatch(modalActions.setActiveChat(prev.activeChat));
    dispatch(modalActions.setActiveOuting(prev.activeOuting));
    dispatch(modalActions.setSelector(prev.selector));
    dispatch(modalActions.setUsePrevious(false));
    scrollModalToTop();
    return Promise.resolve();
  }
  return hideModal();
};
