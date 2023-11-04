import store from ".";
import { socketActions } from "./socket-slice";

export function onConnect() {
  store.dispatch(socketActions.setConnected(true));
}

export function onDisconnect() {
  store.dispatch(socketActions.setConnected(false));
}
