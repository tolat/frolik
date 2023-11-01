import { genMembersString } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModule.module.scss";

const ChatModal = (props) => {
  const memberNames = props.chat.outing.users.map((u) => u.first_name);
  const membersString = genMembersString(memberNames);

  return (
    <ModalPortal>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeftContainer}>
            <div className={styles.outingName}>{props.chat.name}</div>
            <div className={styles.outingMembers}>{membersString}</div>
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
        <div className={styles.chatContainer}>CHAT HERE</div>
        <div className={styles.composeContainer}>COMPOSE HERE</div>
      </div>
    </ModalPortal>
  );
};

export default ChatModal;
