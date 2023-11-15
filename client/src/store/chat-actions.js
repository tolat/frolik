import store from ".";
import { socket } from "../socket";
import { setLastReadMessage } from "../utils/utils";
import { chatActions } from "./chat-slice";

export function receiveChatMessage({ message, chat }) {
  store.dispatch(chatActions.addMessageToChat({ message, chat }));
  const modalState = store.getState().modal;

  // Set last read message if user is viewing the chat
  if (
    modalState.activeChat?._id === chat._id &&
    modalState.selector === "chat-modal"
  ) {
    setLastReadMessage(message);
  }
}

export function sendChatMessage(message, chat) {
  socket.emit("message-sent", { chat, message });
  store.dispatch(chatActions.addMessageToChat({ message, chat }));
  setLastReadMessage(message);
}
