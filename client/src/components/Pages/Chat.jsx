import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/Chat.module.scss";
import { dateSort, pageRouteLoader, toSorted } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import { memo, useState } from "react";
import CreateChatModal from "../Modals/CreateChatModal";
import { modalActions } from "../../store/modal-slice";

const Chat = memo((props) => {
  const chats = useSelector((state) => state.chat.chats);
  const user = useSelector((state) => state.auth.user);
  const [chatSearch, setChatSearch] = useState("");
  const dispatch = useDispatch();
  const validChats = applyChatSearch(
    chats?.filter((c) =>
      c.outing ? !c.outing.flakes.find((uid) => uid === user._id) : true
    )
  );

  const onCreateChat = () => {
    dispatch(modalActions.setSelector("create-chat-modal"));
    dispatch(modalActions.showModal());
  };

  function applyChatSearch(rawChats) {
    return chatSearch || chatSearch !== ""
      ? rawChats.filter((c) => {
          const chatUsers = c.outing ? c.outing.users : c.users;

          return (
            (c.name &&
              c.name
                .toLowerCase()
                .trim()
                .includes(chatSearch.toLowerCase().trim())) ||
            chatUsers.find(
              (u) =>
                u.first_name
                  ?.toLowerCase()
                  .trim()
                  .includes(chatSearch.toLowerCase().trim()) ||
                u.last_name
                  ?.toLowerCase()
                  .trim()
                  .includes(chatSearch.toLowerCase().trim())
            )
          );
        })
      : rawChats;
  }

  return (
    <div className={styles.container}>
      <CreateChatModal />
      <div className={styles.upperContainer}>
        <SimpleButton onClick={onCreateChat} className={styles.newChatButton}>
          + New Chat
        </SimpleButton>
        <SimpleSearch
          setValue={setChatSearch}
          defaultVal={""}
          placeholder={"Search Chats.."}
        />
      </div>
      {!chats ? (
        <h2 style={{ width: "100%", textAlign: "center" }}>Loading Chats..</h2>
      ) : !chats[0] ? (
        <div className={styles.noChatsMessage}>
          <h2 className={styles.noChatsMessageHeader}>Nothing to show yet!</h2>

          <div className={styles.noChatsMessageText}>
            You'll see your chats with friends and for specific Outings here.
          </div>
        </div>
      ) : (
        <div className={styles.chatsContainer}>
          {toSorted(validChats, (a, b) => dateSort(b.touched, a.touched)).map(
            (c) => (
              <ChatCard key={c._id} chat={c} />
            )
          )}
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
