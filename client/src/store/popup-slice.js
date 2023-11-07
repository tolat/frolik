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
      document.getElementById("popup").style.opacity = "1";
      state.selector = action.payload;
    },
    hidePopup(state) {
      document.getElementById("popup").style.display = "none";
      document.getElementById("popup").style.opacity = "0";
      state.selector = "none";
    },
  },
});

export const popupActions = popupSlice.actions;

export default popupSlice.reducer;
