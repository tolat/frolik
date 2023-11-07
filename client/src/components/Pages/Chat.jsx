import { useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import { pageRouteLoader } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import ChatModal from "../Modals/ChatModal";
import { memo, useState } from "react";

const Chat = memo((props) => {
  const chats = useSelector((state) => state.chat.chats);
  const [activeChat, setActiveChat] = useState(false);

  return (
    <div className={styles.container}>
      <ChatModal selector={"chatcard-chat"} chat={activeChat} />
      <h1>Chats</h1>
      <div className={styles.upperContainer}>
        <SimpleSearch placeholder={"Search chats"} />
        <SimpleButton className={styles.newChatButton}>+ New Chat</SimpleButton>
      </div>
      {!chats[0] ? (
        <h2 style={{ width: "100%", textAlign: "center" }}>Loading Chats..</h2>
      ) : (
        <div className={styles.chatsContainer}>
          {chats.map((c) => (
            <ChatCard setActiveChat={setActiveChat} key={c._id} chat={c} />
          ))}
        </div>
      )}
    </div>
  );
});

export default Chat;

export const chatLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
