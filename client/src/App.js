import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { socket } from "./socket";
import { onConnect, onDisconnect } from "./store/socket-actions";
import { receiveChatMessage, sendChatMessage } from "./store/chat-actions";

function App() {
  // Connect socket.io to server for message sending
  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message-sent", sendChatMessage);
    socket.on("new-message", receiveChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message-sent", sendChatMessage);
      socket.off("message-received", receiveChatMessage);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
