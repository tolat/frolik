import { useDispatch, useSelector } from "react-redux";
import { genMembersString, getUnreadChatMessages } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModal.module.scss";
import sendIcon from "../../images/send.png";
import { useEffect, useRef } from "react";
import { sendChatMessage } from "../../store/chat-actions";
import { socket } from "../../socket";
import SimpleButton from "../UI/SimpleButton";
import { goActions } from "../../store/go-slice";
import { useNavigate } from "react-router-dom";
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
  const modalDisplay = modalState.selector === "chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const chatState = useSelector((state) => state.chat.chats);
  const activeChat = useSelector((state) => state.modal.activeChat);
  const chat = chatState.find((c) => c._id === activeChat?._id) || activeChat;
  const lastReadMessage = getUnreadChatMessages(user, props.chat);
  const memberNames = chat?.outing
    ? chat.outing.users.map((u) => u.first_name)
    : chat?.users?.map((u) => u.first_name);
  const membersString = chat && genMembersString(memberNames);
  const messages = chat?.messages;
  const composerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Connect to the websocket for chat
  useEffect(() => {
    if (chat) {
      try {
        socket.emit("join-room", chat._id);
      } catch (err) {
        console.log(err);
      }
    }
  }, [chat]);

  // Send Message
  const handleSendMessage = () => {
    const text = composerRef.current.value;
    if (!text || text === "") return;
    // Create new message
    const newMessage = {
      id: Math.random() + Date.now(),
      message: text,
      user: user._id,
      sent: Date.now(),
      readBy: [user._id],
    };

    sendChatMessage(newMessage, chat);
    composerRef.current.value = "";
    let chatContainerElt = document.getElementById("chat-container");
    chatContainerElt.scrollTop = chatContainerElt.scrollHeight;

    // reset textarea height
    document.getElementById("composer-textarea").style.height = "";
    document.getElementById("composer-textarea").style.height =
      document.getElementById("composer-textarea").scrollHeight + "px";
  };

  const handleCreateOuting = () => {
    dispatch(goActions.reset(chat.users));
    navigate("/go");
  };

  return !chat ? (
    modalState.selector === "chat-modal" ? (
      <h1>Loading Chat..</h1>
    ) : null
  ) : (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <div className={styles.header}>
          <div className={styles.headerLeftContainer}>
            <div>
              <div className={styles.chatName}>{chat.name}</div>
              <div
                className={`${styles.chatMembers} ${
                  chat.outing ? null : styles.nonUserMembers
                }`}
              >
                {membersString}
              </div>
            </div>
            {chat.outing ? null : (
              <SimpleButton
                onClick={handleCreateOuting}
                className={styles.createOutingButton}
              >
                + Outing With Chat Members
              </SimpleButton>
            )}

            <div className={styles.lastActive}>
              Last Active {new Date(chat.touched).toDateString().slice(4, 15)} -{" "}
              {new Date(chat.touched).toTimeString().slice(0, 5)}
            </div>
          </div>

          <div className={styles.headerRightContainer}>
            <UserIconCluster
              users={chat.outing ? chat.outing.users : chat.users}
              sizeInRem={7}
              borderSizeInRem={0.8}
            />
          </div>
        </div>
        <div id="chat-container" className={`${styles.chatContainer} noscroll`}>
          {messages.map((m) => (
            <MessageBubble
              lastReadID={lastReadMessage}
              key={Math.random()}
              user={m.user}
              message={m.message}
              sent={m.sent}
              chatMembers={chat.outing ? chat.outing.users : chat.users}
            />
          ))}
        </div>
        <div className={styles.composeContainer}>
          <textarea
            id="composer-textarea"
            onChange={(e) => {
              e.target.style.height = "";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            className={`${styles.composer} noscroll`}
            ref={composerRef}
          />
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
  const isLastRead = props.message.id === props.lastReadID;
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
      {isLastRead && <div className={styles.lastReadIndicator}> New Below</div>}
    </div>
  );
};

export default ChatModal;
