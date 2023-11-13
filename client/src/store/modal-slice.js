import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  marginLeft: "50%",
  zIndex: "-1",
  opacity: "1",
  activeChat: false,
  activeOuting: false,
  activeModalUser: false,
  previousModal: false,
  usePrevious: false,
};
const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setSelector(state, action) {
      if (state.selector !== 'none') {
        state.previousModal = {
          selector: state.selector,
          activeOuting: state.activeOuting,
          activeChat: state.activeChat,
        };
        console.log('setting prevModal: ', state.previousModal)
      }
      state.selector = action.payload;
    },
    setUsePrevious(state, action) {
      console.log("setting use previous: ", action.payload)
      state.usePrevious = action.payload;
    },
    setZIndex(state, action) {
      state.zIndex = action.payload;
    },
    showModal(state) {
      state.marginLeft = "0%";
      state.zIndex = "1";
    },
    hideModal(state) {
      if (state.marginLeft === "0%") {
        state.marginLeft = "50%";
      }
    },
    setOpacity(state, action) {
      state.opacity = action.payload;
    },
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },
    setActiveOuting(state, action) {
      state.activeOuting = action.payload;
    },
    setActiveModalUser(state, action) {
      state.activeModalUser = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
