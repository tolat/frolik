import store from ".";
import { socket } from "../socket";
import { fetchChats, fetchPhotos } from "../utils/data-fetch";
import { setLastReadMessage } from "../utils/utils";
import { fetchAuth } from "./auth-actions";
import { socketActions } from "./socket-slice";

export function onConnect() {
  console.log("socket connected");
  store.dispatch(socketActions.setIsConnecting(false));
  store.dispatch(socketActions.setConnected(true));
  // Re-join the open chat's room after a reconnect
  const activeChat = store.getState().modal.activeChat;
  if (activeChat?._id) socket.emit("join-room", activeChat._id);
}

export function onDisconnect() {
  console.log("socket disconnected");
  store.dispatch(socketActions.setConnected(false));
}

export function onUpdateUser() {
  console.log("socket user update");
  const user = store.getState().auth.user;
  if (user) {
    fetchChats(user);
    fetchPhotos(user);
  }
  fetchAuth();
}
