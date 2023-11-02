import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { genMembersString } from "../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { fetchChat } from "../../utils/data-fetch";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";

const ChatCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [chat, setChat] = useState(false);
  const dispatch = useDispatch();
  const memberNames = !chat
    ? ""
    : genMembersString(chat.outing.users.map((u) => u.first_name));

  const handleClick = () => {
    props.setActiveChat(chat)
    dispatch(modalActions.setSelector(`chat-modal`));
    dispatch(modalActions.showModal());
  };

  // Get populated chat from server
  useEffect(() => {
    fetchChat(user._id, props.chat, setChat);
  }, [user._id, props.chat]);

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
          Last active -{` ${new Date(chat.touched).toDateString()}`}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
