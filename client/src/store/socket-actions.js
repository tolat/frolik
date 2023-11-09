import store from ".";
import { fetchChats } from "../utils/data-fetch";
import { fetchAuth } from "./auth-actions";
import { socketActions } from "./socket-slice";

export function onConnect() {
  store.dispatch(socketActions.setConnected(true));
}

export function onDisconnect() {
  store.dispatch(socketActions.setConnected(false));
}

export function onUpdateUser(){
  const user = store.getState().auth.user
  console.log("PUSH UPDATE FOR: ", user)
  fetchAuth()
  fetchChats(user)
}
