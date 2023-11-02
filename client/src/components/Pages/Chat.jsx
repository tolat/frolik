import { useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import { pageRouteLoader } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import ChatModal from "../Modals/ChatModal";
import { Fragment, memo, useMemo, useState } from "react";

const Chat = memo((props) => {
  const user = useSelector((state) => state.auth.user);
  const [activeChat, setActiveChat] = useState(false);

  const ChatList = ({ user, setActiveChat }) => {
    // Memoize the rendering of ChatCard components
    const memoizedChatCards = useMemo(() => {
      return user.chats.map((c) => (
        <ChatCard setActiveChat={setActiveChat} key={c.id} chat={c} />
      ));
    }, [user.chats, setActiveChat]);
  
    return <Fragment>{memoizedChatCards}</Fragment>
  };

  return (
    <div className={styles.container}>
      <ChatModal chat={activeChat} />
      <div className={styles.upperContainer}>
        <SimpleSearch />
        <SimpleButton className={styles.newChatButton}>+ New Chat</SimpleButton>
      </div>
      <ChatList user={user} setActiveChat={setActiveChat}/>
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
