import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  marginLeft: "50%",
  zIndex: "-1",
  opacity: "1"
};
const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setSelector(state, action) {
      state.selector = action.payload;
    },
    setZIndex(state, action) {
      state.zIndex = action.payload;
    },
    showModal(state) {
      if (state.marginLeft === "50%") {
        state.marginLeft = "0%";
        state.zIndex = "1"
      }
    },
    hideModal(state) {
      if (state.marginLeft === "0%") {
        state.marginLeft = "50%";
      }
    },
    setOpacity(state, action){
      state.opacity = action.payload
    }
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
