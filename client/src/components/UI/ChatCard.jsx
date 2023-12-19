import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import {
  genMembersString,
  getUnreadChatMessages,
  setLastReadMessage,
} from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { fetchChat } from "../../utils/data-fetch";

const ChatCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const chat = props.chat;
  const globals = useSelector((state) => state.auth.globals);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getUnreadChatMessages(user, chat);

  const memberNames = !chat
    ? ""
    : genMembersString(
        chat?.outing
          ? chat?.outing?.users.map((u) => u.first_name)
          : chat?.users?.map((u) => u.first_name)
      );

  const handleClick = () => {
    const onChatFetched = () => {
      dispatch(modalActions.setActiveChat(props.chat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
      setLastReadMessage();
    };
    fetchChat(user._id, props.chat._id, onChatFetched);
  };

  return !chat ? null : (
    <div className={styles.outerContainer}>
      {chat.outing ? (
        <div
          style={{
            backgroundColor:
              globals.categoryColorMap[chat.outing.activity.category],
          }}
          className={styles.categoryStripe}
        ></div>
      ) : null}
      <div
        onClick={handleClick}
        style={props.style}
        className={styles.container}
      >
        {unreadChatMessages > 0 ? (
          <div className={styles.notificationBadge}>
            {unreadChatMessages > 0 && unreadChatMessages}
          </div>
        ) : null}
        <div className={styles.iconClusterContainer}>
          <UserIconCluster
            users={chat.outing ? chat.outing.users : chat.users}
            sizeInRem={8.5}
            borderSizeInRem={0.8}
          />
        </div>
        <div className={styles.leftSection}>
          <div>
            <div className={styles.name}>{chat.name}</div>
            {chat.outing && (
              <div className={styles.outingActivity}>
                {chat.outing.activity.name}
              </div>
            )}
            <div
              className={`${styles.memberNames} ${
                chat.outing ? null : styles.nonUserMembers
              }`}
            >
              {memberNames}
            </div>
          </div>
          <div className={styles.lastActive}>
            Last Active {new Date(chat.touched).toDateString().slice(4, 15)} -{" "}
            {new Date(chat.touched).toTimeString().slice(0, 5)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
