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
import { authActions } from "./store/auth-slice";
import { autoUpdateLocation } from "./utils/location";
import {
  applyPrimaryColor,
  dominantCategory,
  FOLLOW_COLOUR_WHEEL,
} from "./utils/theme";

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

  // Primary colour: the dominant colour of the user's colour wheel (the
  // default blue when logged out or before their first outing), when
  // FOLLOW_COLOUR_WHEEL is on in utils/theme.js
  const categoryColorMap = useSelector(
    (state) => state.auth.globals?.categoryColorMap
  );
  const dominant = FOLLOW_COLOUR_WHEEL
    ? dominantCategory(user, categoryColorMap)
    : null;
  const dominantColor = dominant ? categoryColorMap[dominant] : null;
  useEffect(() => {
    applyPrimaryColor(dominantColor);
  }, [dominantColor]);

  // Register service worker and set app badge prompt if logged in
  useEffect(() => {
    if (user) {
      const unreadMessages =
        (getTotalUnreadMessages(user) || 0) + (user.notifications?.length || 0);
      setBadge(unreadMessages);
    }
  }, [user]);

  // Register the service worker once per logged-in user (it used to
  // re-register — adding intervals and listeners — on every user update)
  const userID = user?._id;
  useEffect(() => {
    if (userID) serviceWorkerRegistration.register({ user: store.getState().auth.user });
  }, [userID]);

  // "Keep my location up to date": refresh the city on open and whenever the
  // app comes back to the foreground (throttled + silent; see location.js)
  const autoLocation = !!user?.auto_location;
  useEffect(() => {
    if (!userID || !autoLocation) return;
    const run = () => {
      const current = store.getState().auth.user;
      autoUpdateLocation(current)
        .then((updated) => {
          if (updated) {
            store.dispatch(
              authActions.setUser({ ...store.getState().auth.user, ...updated })
            );
          }
        })
        .catch((err) => console.log("Auto location skipped:", err.message));
    };
    run();
    const onVisible = () => document.visibilityState === "visible" && run();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [userID, autoLocation]);

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
    const currentUser = store.getState().auth.user;
    if (currentUser) {
      //add user to go state
      store.dispatch(goActions.addUser(currentUser));
      connectSocket(socket, currentUser);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message-sent", sendChatMessage);
      socket.off("new-message", receiveChatMessage);
      socket.off("update-user", onUpdateUser);
      socket.disconnect();
    };
  }, [userID]);

  // Handle socket reconnection from dead server etc.
  // Only run the reconnect interval while a user is logged in.
  useEffect(() => {
    if (!userID) return;

    // Set window listener to check if socket is connected
    const checkSocketConnection = () => {
      if (!socket.connected) {
        dispatch(socketActions.setIsConnecting(true));
        connectSocket(socket, store.getState().auth.user);
      }
    };

    // Check socket connection every ~1-2 seconds
    const intervalID = window.setInterval(
      checkSocketConnection,
      1000 + Math.random() * 1000
    );

    return () => {
      dispatch(socketActions.setIsConnecting(false));
      window.clearInterval(intervalID);
    };
  }, [userID, dispatch]);

  // Add event listener for pwa install event
  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      dispatch(modalActions.setInstallPrompted(event));
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
