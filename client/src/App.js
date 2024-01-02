import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { socket } from "./socket";
import { onConnect, onDisconnect, onUpdateUser } from "./store/socket-actions";
import { receiveChatMessage, sendChatMessage } from "./store/chat-actions";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import { goActions } from "./store/go-slice";
import { fetchGlobals } from "./utils/data-fetch";
import { setBadge } from "./utils/badge";
import { getTotalUnreadMessages } from "./utils/utils";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { socketActions } from "./store/socket-slice";
import { modalActions } from "./store/modal-slice";
import PullToRefresh from "pulltorefreshjs";

const connectSocket = async (socket, user) => {
  try {
    await socket.connect();
    socket.emit("join-room", user._id);
  } catch (err) {
    console.log(err);
  }
};

function App() {
  const dispatch = useDispatch();
  // Connect socket.io to server for message sending
  const user = useSelector((state) => state.auth.user);

  // Register service worker and set app badge prompt if logged in
  useEffect(() => {
    if (user) {
      serviceWorkerRegistration.register({ user });
      const unreadMessages =
        getTotalUnreadMessages(user) + user.notifications?.length;
      setBadge(unreadMessages);
    }
  }, [user]);

  // Fetch Globals once on app load
  useEffect(() => {
    fetchGlobals();
  }, []);

  // Handle websocket events
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
      connectSocket(socket, user);
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

  // Handle socket reconnection from dead server etc.
  useEffect(() => {
    // Set window listener to check if socket is connected
    const checkSocketConnection = () => {
      if (!socket.connected) {
        dispatch(socketActions.setIsConnecting(true));
        console.log("trying to reconnect socket..");
        connectSocket(socket, user);
      }
    };

    // Check socket connection every 1.random seconds
    const intervalID = window.setInterval(
      checkSocketConnection,
      1000 + Math.random() * 1000
    );

    return () => {
      dispatch(socketActions.setIsConnecting(false));
      window.clearInterval(intervalID);
    };
  });

  // Add event listener for pwa install event
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      dispatch(modalActions.setInstallPrompted(event));
    });
  });

  // Add event litener to enable pulldownrefresh
  useEffect(() => {
    const standalone =
      navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (!standalone) {
      return; // not standalone; no pull to refresh needed
    }

    PullToRefresh.init({
      onRefresh() {
        window.location.reload();
      },
    });
  });

  // Add check to check localstorage for user update flag
  useEffect(() => {
    const checkForUpdateFlag = () => {
      const updateUser = localStorage.getItem("frolik-user-update");
      if (updateUser && user) {
        onUpdateUser();
        localStorage.setItem('frolik-user-update', null)
      }
    };

    // Check socket connection every 1.random seconds
    const intervalID = window.setInterval(checkForUpdateFlag, 2000);

    return () => {
      window.clearInterval(intervalID);
    };
  }, [user]);

  return <RouterProvider router={router} />;
}

export default App;
