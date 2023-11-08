import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  display: "none",
};
const popupSlice = createSlice({
  name: "popup",
  initialState: initialState,
  reducers: {
    showPopup(state, action) {
      document.getElementById("popup").style.display = "flex";
      state.selector = action.payload;
    },
    hidePopup(state) {
      document.getElementById("popup").style.display = "none";
      state.selector = "none";
    },
  },
});

export const popupActions = popupSlice.actions;

export default popupSlice.reducer;
