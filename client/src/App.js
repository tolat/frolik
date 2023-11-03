import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { socket } from "./socket";
import {
  onConnect,
  onDisconnect,
  onMessageReceive,
  onMessageSend,
} from "./store/socket-actions";

function App() {
  // Connect socket.io to server for message sending
  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message-send", onMessageSend);
    socket.on("message-receive", onMessageReceive);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message-send", onMessageSend);
      socket.off("message-receive", onMessageReceive);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
