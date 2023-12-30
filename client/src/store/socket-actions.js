import store from ".";
import { fetchChats, fetchPhotos } from "../utils/data-fetch";
import { setLastReadMessage } from "../utils/utils";
import { fetchAuth } from "./auth-actions";
import { socketActions } from "./socket-slice";

export function onConnect() {
  console.log('socket connected')
  onUpdateUser()
  store.dispatch(socketActions.setConnected(true));
}

export function onDisconnect() {
  console.log('socket disconnected')
  store.dispatch(socketActions.setConnected(false));
}

export function onUpdateUser(){
  console.log('socket user update')
  const user = store.getState().auth.user
  fetchAuth()
  fetchChats(user)
  fetchPhotos(user)
  setLastReadMessage()
}
