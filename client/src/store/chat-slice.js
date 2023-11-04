import { createSlice } from "@reduxjs/toolkit";

const initialState = { chats: [] };
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
      const oldChat = state.chats.find(
        (c) => c._id === action.payload.chat._id
      );
      const chatIndex = state.chats.indexOf(oldChat);
      if (oldChat.touched !== action.payload.chat.touched) {
        state.chats.splice(chatIndex, 1, action.payload.chat);
      }
    },
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
