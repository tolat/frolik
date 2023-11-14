import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import { pageRouteLoader } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import { memo } from "react";
import CreateChatModal from "../Modals/CreateChatModal";
import { modalActions } from "../../store/modal-slice";

const Chat = memo((props) => {
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch()

  const onCreateChat = () => {
      dispatch(modalActions.setSelector('create-chat-modal'))
      dispatch(modalActions.showModal())
  };

  return (
    <div className={styles.container}>
      <CreateChatModal />
      <h1>Chats</h1>
      <div className={styles.upperContainer}>
        <SimpleSearch placeholder={"Search chats"} />
        <SimpleButton onClick={onCreateChat} className={styles.newChatButton}>
          + New Chat
        </SimpleButton>
      </div>
      {!chats[0] ? (
        <h2 style={{ width: "100%", textAlign: "center" }}>Loading Chats..</h2>
      ) : (
        <div className={styles.chatsContainer}>
          {chats.map((c) => (
            <ChatCard key={c._id} chat={c} />
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
