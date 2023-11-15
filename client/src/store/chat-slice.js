import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  fetchingChats: false,
  updatingLastRead: false,
};
const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload.chats;
    },
    addMessageToChat(state, action) {
      let chat = state.chats.find((c) => c._id === action.payload.chat._id);
      const message = action.payload.message;

      // Add message if chat exists and message has not already been added
      if (chat && !chat.messages.find((m) => m.id === message.id)) {
        chat.messages.unshift(message);
      }
    },
    updateChat(state, action) {
      const oldChat = state.chats.find((c) => c._id === action.payload._id);
      const chatIndex = state.chats.indexOf(oldChat);
      if (!oldChat || oldChat.touched !== action.payload.touched) {
        state.chats.splice(chatIndex, 1, action.payload);
      }
    },
    setFetchingChats(state, action) {
      state.fetchingChats = action.payload;
    },
    setUpdatingLastRead(state, action) {
      state.updatingLastRead = action.payload;
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
