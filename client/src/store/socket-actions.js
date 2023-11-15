import store from ".";
import { fetchChats, fetchPhotos } from "../utils/data-fetch";
import { setLastReadMessage } from "../utils/utils";
import { fetchAuth } from "./auth-actions";
import { socketActions } from "./socket-slice";

export function onConnect() {
  store.dispatch(socketActions.setConnected(true));
}

export function onDisconnect() {
  store.dispatch(socketActions.setConnected(false));
}

export function onUpdateUser(){
  console.log('receivedUserUpdate')
  const user = store.getState().auth.user
  fetchAuth()
  fetchChats(user)
  fetchPhotos(user)
  setLastReadMessage()
}
