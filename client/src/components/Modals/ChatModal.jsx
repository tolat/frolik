import { useSelector } from "react-redux";
import { genMembersString } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModal.module.scss";
import sendIcon from "../../images/send.png";
import { useEffect, useState } from "react";

const bubbleColours = [
  "rgb(247, 226, 250)",
  "rgb(252, 225, 225)",
  "rgb(252, 238, 188)",
  "rgb(227, 251, 220)",
  "rgb(217, 248, 254)",
];

const ChatModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const usersData = useSelector((state) => state.data.users);
  const modalDisplay = modalState.selector === "chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [messages, setMessages] = useState([]);
  const memberNames =
    props.chat && props.chat.outing.users.map((u) => u.first_name);
  const membersString = genMembersString(memberNames);

  // Initialize messages when the chat loads
  useEffect(() => {
    const initialMessages = !props.chat
      ? []
      : props.chat.messages.toSorted(
          (a, b) => new Date(b.sent).getTime() - new Date(a.sent).getTime()
        );

    setMessages(initialMessages);
  }, [props.chat]);

  const MessageBubble = (props) => {
    const messageUser = usersData[props.user];
    const foreign = props.user !== user._id;
    const sentDate = new Date(props.sent);
    const colourIndex =
      props.chatMembers &&
      props.chatMembers.map((u) => u._id).indexOf(props.user) % 5;
    const bubbleColour = bubbleColours[colourIndex];
    const tailStyle = {
      borderRight: `15px solid ${bubbleColour}`,
      borderTop: `15px solid ${bubbleColour}`,
    };
    const foreignTailStyle = {
      borderLeft: `15px solid ${bubbleColour}`,
      borderTop: `15px solid ${bubbleColour}`,
    };

    return (
      <div
        className={`${
          foreign ? styles.bubbleContainerForeign : styles.bubbleContainer
        }`}
      >
        <div
          style={{ backgroundColor: bubbleColour }}
          className={styles.bubble}
        >
          <div
            className={styles.bubbleUser}
          >{`${messageUser.first_name} ${messageUser.last_name}`}</div>
          <div className={styles.bubbleMessage}>{props.message}</div>
          <div
            style={foreign ? foreignTailStyle : tailStyle}
            className={foreign ? styles.bubbleTailForeign : styles.bubbleTail}
          ></div>
          <div className={styles.sent}>
            {sentDate.toDateString().slice(4, 15)} -{" "}
            {sentDate.toTimeString().slice(0, 5)}
          </div>
        </div>
      </div>
    );
  };

  return !props.chat ? null : (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeftContainer}>
            <div>
              <div className={styles.chatName}>{props.chat.name}</div>
              <div className={styles.chatMembers}>{membersString}</div>
            </div>
            <div className={styles.lastActive}>
              Last active - {new Date(props.chat.touched).toDateString()}
            </div>
          </div>

          <div className={styles.headerRightContainer}>
            <UserIconCluster
              backerClassName={styles.iconBacker}
              users={props.chat.outing.users}
              sizeInRem={7}
              borderSizeInRem={0.8}
            />
          </div>
        </div>
        <div className={styles.chatContainer}>
          {messages.map((m) => (
            <MessageBubble
              key={Math.random()}
              user={m.user}
              message={m.message}
              sent={m.sent}
              chatMembers={props.chat.outing.users}
            />
          ))}
        </div>
        <div className={styles.composeContainer}>
          <textarea className={styles.composer} />
          <button className={styles.sendButton}>
            <img className={styles.sendIcon} src={sendIcon} alt="send-icon" />
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ChatModal;
