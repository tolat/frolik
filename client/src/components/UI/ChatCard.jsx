import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { genMembersString } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { fetchChat } from "../../utils/data-fetch";

const ChatCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const chat = props.chat;
  const dispatch = useDispatch();
  const memberNames = !chat
    ? ""
    : genMembersString(chat?.outing?.users.map((u) => u.first_name));

  const handleClick = () => {
    const onChatFetched = () => {
      dispatch(modalActions.setActiveChat(props.chat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal());
    };
    fetchChat(user._id, props.chat._id, onChatFetched);
  };

  return !chat ? null : (
    <div onClick={handleClick} style={props.style} className={styles.container}>
      <div className={styles.iconClusterContainer}>
        <UserIconCluster
          users={chat.outing.users}
          sizeInRem={7}
          borderSizeInRem={0.8}
        />
      </div>
      <div className={styles.leftSection}>
        <div>
          <div className={styles.name}>{chat.name}</div>
          <div className={styles.memberNames}>{memberNames}</div>
        </div>
        <div className={styles.lastActive}>
          Last Active {new Date(chat.touched).toDateString().slice(4, 15)} -{" "}
          {new Date(chat.touched).toTimeString().slice(0, 5)}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
