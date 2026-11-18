import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selector: "none",
  display: "none",
  showCreateOutingPopup: false,
  popupImage: false,
  warningMessage: "",
  warningHeader: "",
  // Optional action for the generic warning, from the server's 406 body,
  // e.g. { type: "resend-verification", email }
  warningAction: null,
  // Activity being sent to a friend ("send-activity" popup)
  sendActivity: null,
  // Activity opened from a chat message ("shared-activity" popup)
  sharedActivity: null,
};
const popupSlice = createSlice({
  name: "popup",
  initialState: initialState,
  reducers: {
    showPopup(state, action) {
      state.selector = action.payload;
    },
    hidePopup(state) {
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
    setWarningAction(state, action) {
      state.warningAction = action.payload;
    },
    setSendActivity(state, action) {
      state.sendActivity = action.payload;
    },
    setSharedActivity(state, action) {
      state.sharedActivity = action.payload;
    },
  },
});

export const popupActions = popupSlice.actions;

export default popupSlice.reducer;
