import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  headerStyle: {},
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
      if (state.selector !== "none") {
        state.previousModal = {
          selector: state.selector,
          activeOuting: state.activeOuting,
          activeChat: state.activeChat,
          headerStyle: state.headerStyle,
        };
      }
      state.selector = action.payload;
    },
    setUsePrevious(state, action) {
      state.usePrevious = action.payload;
    },
    setZIndex(state, action) {
      state.zIndex = action.payload;
    },
    showModal(state, action) {
      document.documentElement.style.overflowY = "clip";
      setTimeout(() => {
        document.getElementById("main-container-children").style.opacity = 0;
      }, 300);
      state.marginLeft = "0%";
      state.zIndex = "2";
      if (action?.payload?.headerStyle) {
        if (
          state.selector === "chat-modal" &&
          action.payload.headerStyle.backgroundColor === "transparent"
        ) {
          state.headerStyle = action.payload.headerStyle;
        } else {
          state.headerStyle = { backgroundColor: "white" };
        }
      } else if (state.selector !== "chat-modal") {
        state.headerStyle = { backgroundColor: "white" };
      }
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
    setHeaderStyle(state, action) {
      console.log("setting header style: ", action.payload);
      state.headerStyle = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
