import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: null,
  marginLeft: "100%",
  zIndex: "-1",
};
const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setContent(state, action) {
      state.content = action.payload;
    },
    setZIndex(state, action) {
      state.zIndex = action.payload;
    },
    showModal(state) {
      if (state.marginLeft === "50%") {
        state.marginLeft = "0%";
      }
    },
    hideModal(state) {
      if (state.marginLeft === "0%") {
        state.marginLeft = "50%";
      }
    },
    toggleModal(state) {
      if (state.marginLeft === "50%") {
        state.marginLeft = "0%";
        state.zIndex = "1";
      } else {
        state.marginLeft = "50%";
      }
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
