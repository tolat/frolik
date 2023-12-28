import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { socket } from "./socket";
import { onConnect, onDisconnect, onUpdateUser } from "./store/socket-actions";
import { receiveChatMessage, sendChatMessage } from "./store/chat-actions";
import { useSelector } from "react-redux";
import store from "./store";
import { goActions } from "./store/go-slice";
import { fetchGlobals } from "./utils/data-fetch";
import { setBadge } from "./utils/badge";
import { getTotalUnreadMessages } from "./utils/utils";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

function App() {
  // Connect socket.io to server for message sending
  const user = useSelector((state) => state.auth.user);

  // Register service worker if logged in ad set app badge
  useEffect(() => {
    if (user) {
      serviceWorkerRegistration.register({user});
      const unreadMessages = getTotalUnreadMessages(user) + user.notifications?.length;
      setBadge(unreadMessages)
    }
  }, [user]);

  // Fetch Globals once on app load
  useEffect(() => {
    fetchGlobals();
  }, []);

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message-sent", sendChatMessage);
    socket.on("new-message", receiveChatMessage);
    socket.on("update-user", onUpdateUser);

    // Connect once user is authenticated
    if (user) {
      //add user to go state
      store.dispatch(goActions.addUser(user));

      try {
        socket.connect();
        socket.emit("join-room", user._id);
      } catch (err) {
        console.log(err);
      }
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message-sent", sendChatMessage);
      socket.off("message-received", receiveChatMessage);
      socket.off("update-user", onUpdateUser);
      socket.disconnect();
    };
  }, [user]);

  return <RouterProvider router={router} />;
}

export default App;
