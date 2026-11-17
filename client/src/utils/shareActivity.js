import store from "../store";
import { createChat, fetchChat, fetchChats } from "./data-fetch";
import { sendChatMessage } from "../store/chat-actions";
import { modalActions } from "../store/modal-slice";
import { popupActions } from "../store/popup-slice";
import { swapModal } from "../store/modal-actions";
import { setLastReadMessage } from "./utils";

// Small snapshot carried by the chat message (the server rebuilds it from
// the database; this copy is only for the sender's own optimistic render)
const snapshot = (a) => ({
  _id: a._id,
  name: a.name,
  category: a.category,
  location: a.location,
});

const openChat = (chat) => {
  const open = () => {
    store.dispatch(modalActions.setActiveChat(chat));
    store.dispatch(modalActions.setSelector("chat-modal"));
    store.dispatch(
      modalActions.showModal({ headerStyle: { backgroundColor: "transparent" } })
    );
  };
  // Over an open panel: swap in place (Back returns to it); else slide in
  swapModal(open);
};

// Send an activity to a friend: reuse your chat with them (or start one),
// post the activity as a message, then open that chat.
export const sendActivityToFriend = (friend, activity, onDone = () => {}) => {
  const user = store.getState().auth.user;
  if (!user || !friend || !activity?._id) return onDone(false);

  createChat(user, [friend], (response) => {
    const chat = response?.chat;
    if (!chat?._id) return onDone(false);

    // Make sure the chat is in the store before adding the message to it
    fetchChat(user._id, chat._id, () => {
      const message = {
        id: Math.random() + Date.now(),
        message: "",
        activity: snapshot(activity),
        user: user._id,
        sent: Date.now(),
        readBy: [user._id],
      };
      const storedChat =
        store.getState().chat.chats.find((c) => c._id === chat._id) || chat;
      sendChatMessage(message, storedChat);
      fetchChats(user);
      store.dispatch(popupActions.hidePopup());
      openChat(storedChat);
      setLastReadMessage(message); // your own message: nothing unread here
      onDone(true);
    });
  });
};
