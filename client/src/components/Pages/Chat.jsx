import { useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import { pageRouteLoader } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";

const Chat = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.container}>
      <div className={styles.upperContainer}>
        <SimpleSearch />
        <SimpleButton className={styles.newChatButton}>+ New Chat</SimpleButton>
      </div>

      <div className={styles.chatsContainer}>
        {user.chats.map((c) => (
          <ChatCard key={Math.random()} chat={c} />
        ))}
      </div>
    </div>
  );
};

export default Chat;

export const chatLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
