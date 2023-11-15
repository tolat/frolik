import store from ".";
import { socket } from "../socket";
import { setLastReadMessage } from "../utils/utils";
import { chatActions } from "./chat-slice";

export function receiveChatMessage({ message, chat }) {
  store.dispatch(chatActions.addMessageToChat({ message, chat }));
}

export function sendChatMessage(message, chat) {
  socket.emit("message-sent", { chat, message });
  store.dispatch(chatActions.addMessageToChat({ message, chat }));
  setLastReadMessage(message)
}
