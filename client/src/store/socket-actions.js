import store from ".";
import { socketActions } from "./socket-slice";

export function onConnect() {
  store.dispatch(socketActions.setConnected(true));
}

export function onDisconnect() {
  store.dispatch(socketActions.setConnected(false));
}

export function onMessageReceive(value) {
  console.log(value);
}

export function onMessageSend(value) {
  console.log(value);
}
