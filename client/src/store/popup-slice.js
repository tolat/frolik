import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  display: "none",
  showCreateOutingPopup: false,
  popupImage: false,
  warningMessage: "",
  warningHeader: "",
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
      state.showCreateOutingPopup = false;
      state.selector = "none";
    },
    setShowCreateOutingPopup(state, action) {
      state.showCreateOutingPopup = action.payload;
    },
    setPopupImage(state, action) {
      state.popupImage = action.payload;
    },
    setWarningMessage(state, action) {
      state.warningMessage = action.payload;
    },
    setWarningHeader(state, action) {
      state.warningHeader = action.payload;
    },
  },
});

export const popupActions = popupSlice.actions;

export default popupSlice.reducer;
