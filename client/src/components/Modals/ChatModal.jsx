import { useSelector } from "react-redux";
import { genMembersString } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModal.module.scss";

const ChatModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const memberNames =
    props.chat && props.chat.outing.users.map((u) => u.first_name);
  const membersString = genMembersString(memberNames);

  return !props.chat ? null : (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeftContainer}>
            <div className={styles.chatName}>{props.chat.name}</div>
            <div className={styles.chatMembers}>{membersString}</div>
          </div>

          <div className={styles.headerRightContainer}>
            <UserIconCluster
              backerClassName={styles.iconBacker}
              users={props.chat.outing.users}
              sizeInRem={7}
              borderSizeInRem={0.5}
            />
          </div>
        </div>
        <div className={styles.chatContainer}></div>
        <div className={styles.composeContainer}>
          <textarea className={styles.composer}/>
          <button className={styles.sendButton}>
            <img />
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ChatModal;
