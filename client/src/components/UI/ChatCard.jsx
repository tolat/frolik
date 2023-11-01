import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { genMembersString } from "../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { fetchChat } from "../../utils/data-fetch";
import { useSelector } from "react-redux";

const ChatCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [chat, setChat] = useState(false);
  const memberNames = !chat
    ? ""
    : genMembersString(chat.outing.users.map((u) => u.first_name));

     // Memoize the fetchChat function
  const memoizedFetchChat = useMemo(() => {
    return (userID, chatID, setChat) => {
      fetchChat(userID, chatID, setChat)
    };
  }, []); 

  // Get populated chat from server
  useEffect(() => {
    memoizedFetchChat(user._id, props.chat, setChat);
  }, [props.chat, user._id, memoizedFetchChat]);

  return !chat ? null : (
    <div style={props.style} className={styles.container}>
      <div className={styles.iconClusterContainer}>
        <UserIconCluster
          backerClassName={styles.iconBacker}
          users={chat.outing.users}
          sizeInRem={7}
          borderSizeInRem={0.5}
        />
      </div>
      <div className={styles.leftSection}>
        <div>
          <div className={styles.name}>{chat.name}</div>
          <div className={styles.memberNames}>{memberNames}</div>
        </div>
        <div className={styles.lastActive}>
            Last active - 
          {` ${new Date(chat.touched).toDateString()}`}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
