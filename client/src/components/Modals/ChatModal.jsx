import { useSelector } from "react-redux";
import { genMembersString } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModal.module.scss";
import sendIcon from "../../images/send.png";
import { useEffect, useRef } from "react";
import { socket } from "../../socket";
import { sendChatMessage } from "../../store/chat-actions";
import { fetchChat } from "../../utils/data-fetch";

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
  const chatsState = useSelector((state) => state.chat.chats);
  const modalDisplay = modalState.selector === "chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const chat = chatsState.find((c) => c._id === props.chat._id);
  const memberNames = !!chat && chat.outing.users.map((u) => u.first_name);
  const membersString = genMembersString(memberNames);
  const messages = chat?.messages;
  const composerRef = useRef();

  // Fetch chat from server just to make sure no messages are missed
  // which can happen if chat modal is closed and message is sent while
  // user is on chat page. updates the chat state once chat is fetched.
  useEffect(() => {
    fetchChat(user._id, chat?._id);
  }, [user._id, chat]);

  // Connect to the websocket for chat
  useEffect(() => {
    if (chat) {
      // no-op if the socket is already connected
      socket.connect();
      socket.emit("join-room", chat._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  const handleSendMessage = () => {
    const text = composerRef.current.value;
    if (!text || text === "") return;
    // Create new message
    const newMessage = {
      id: Math.random() + Date.now(),
      message: text,
      user: user._id,
      sent: Date.now(),
    };

    // Update to this chat in chat store to add message and
    // emit a message-sent event over the web socket connection
    sendChatMessage(newMessage, chat);
    composerRef.current.value = "";
    let chatContainerElt = document.getElementById("chat-container");
    chatContainerElt.scrollTop = chatContainerElt.scrollHeight;
  };

  return !chat ? null : (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <div className={styles.header}>
          <div className={styles.headerLeftContainer}>
            <div>
              <div className={styles.chatName}>{chat.name}</div>
              <div className={styles.chatMembers}>{membersString}</div>
            </div>
            <div className={styles.lastActive}>
              Last Active {new Date(chat.touched).toDateString().slice(4, 15)} -{" "}
              {new Date(chat.touched).toTimeString().slice(0, 5)}
            </div>
          </div>

          <div className={styles.headerRightContainer}>
            <UserIconCluster
              backerClassName={styles.iconBacker}
              users={chat.outing.users}
              sizeInRem={7}
              borderSizeInRem={0.8}
            />
          </div>
        </div>
        <div id="chat-container" className={`${styles.chatContainer} noscroll`}>
          {messages.map((m) => (
            <MessageBubble
              key={Math.random()}
              user={m.user}
              message={m.message}
              sent={m.sent}
              chatMembers={chat.outing.users}
            />
          ))}
        </div>
        <div className={styles.composeContainer}>
          <textarea className={styles.composer} ref={composerRef} />
          <button onClick={handleSendMessage} className={styles.sendButton}>
            <img className={styles.sendIcon} src={sendIcon} alt="send-icon" />
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

const MessageBubble = (props) => {
  const user = useSelector((state) => state.auth.user);
  const usersData = useSelector((state) => state.data.users);
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
      <div style={{ backgroundColor: bubbleColour }} className={styles.bubble}>
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

export default ChatModal;
