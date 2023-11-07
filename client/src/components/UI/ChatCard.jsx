import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { genMembersString } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-slice";

const ChatCard = (props) => {
  const chat = props.chat;
  const dispatch = useDispatch();
  const memberNames = !chat
    ? ""
    : genMembersString(chat.outing.users.map((u) => u.first_name));

  const handleClick = () => {
    props.setActiveChat(chat);
    dispatch(modalActions.setSelector(`chatcard-chat`));
    dispatch(modalActions.showModal());
  };

  return !chat ? null : (
    <div onClick={handleClick} style={props.style} className={styles.container}>
      <div className={styles.iconClusterContainer}>
        <UserIconCluster
          backerClassName={styles.iconBacker}
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
