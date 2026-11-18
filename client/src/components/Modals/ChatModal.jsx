import { useDispatch, useSelector } from "react-redux";
import BrandLoader from "../UI/BrandLoader";
import { genMembersString, getUnreadChatMessages } from "../../utils/utils";
import UserIconCluster from "../UI/UserIconCluster";
import ModalPortal from "./ModalPortal";
import styles from "./styles/ChatModal.module.scss";
import ModalHeaderPortal from "./ModalHeaderPortal";
import ModalButtonPortal from "./ModalButtonPortal";
import { useEffect, useRef, useState } from "react";
import { popupActions } from "../../store/popup-slice";
import { fetchActivityDetails } from "../../utils/data-fetch";
import { sendChatMessage } from "../../store/chat-actions";
import { socket } from "../../socket";
import { goActions } from "../../store/go-slice";
import { useNavigate } from "react-router-dom";
import { modalActions } from "../../store/modal-slice";
import { swapModal } from "../../store/modal-actions";
import { useT } from "../../i18n";
// Sender-name colours for other people's messages
const nameColours = ["#9b5de5", "#e05a6a", "#d68a00", "#2f9e66", "#1f8fbf"];

const ChatModal = (props) => {
  const { t, formatDate } = useT();
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
    navigate("/outing");
  };

  const handleShowOuting = () => {
    swapModal(() => {
      dispatch(modalActions.setActiveOuting(chat.outing));
      dispatch(modalActions.setSelector("outing-modal"));
      dispatch(modalActions.showModal());
    });
  };

  const members = chat ? (chat.outing ? chat.outing.users : chat.users) : [];

  return !chat ? (
    modalState.selector === "chat-modal" ? (
      <BrandLoader />
    ) : null
  ) : (
    <ModalPortal>
      {/* Chat identity lives in the fixed modal header bar */}
      <ModalHeaderPortal selector={"chat-modal"}>
        <div className={styles.headerIdentity}>
          <div className={styles.headerAvatars}>
            <UserIconCluster
              users={members}
              sizeInRem={4.2}
              borderSizeInRem={0.35}
            />
          </div>
          <div className={styles.headerText}>
            <div className={styles.chatName}>
              {chat.outing ? chat.name : membersString}
            </div>
            <div className={styles.chatMembers}>
              {chat.outing
                ? membersString
                : t("chatRoom.active", {
                    date: formatDate(chat.touched, {
                      month: "short",
                      day: "numeric",
                    }),
                  })}
            </div>
          </div>
        </div>
      </ModalHeaderPortal>
      <ModalButtonPortal selector={"chat-modal"}>
        <button
          type="button"
          onClick={chat.outing ? handleShowOuting : handleCreateOuting}
          className={styles.headerAction}
        >
          {chat.outing ? t("chatRoom.outing") : t("chatRoom.newOuting")}
        </button>
      </ModalButtonPortal>

      <div style={modalStyle} className={`${styles.container} noscroll chat-panel`}>
        <div id="chat-container" className={`${styles.chatContainer} noscroll`}>
          {messages.map((m, i) => {
            // messages are newest-first; render order is reversed by CSS
            const older = messages[i + 1];
            const newer = messages[i - 1];
            const sameAsOlder = older && older.user === m.user;
            const sameAsNewer = newer && newer.user === m.user;
            return (
              <MessageBubble
                lastReadID={lastReadMessage}
                key={m.id || i}
                id={m.id}
                user={m.user}
                message={m.message}
                activity={m.activity}
                sent={m.sent}
                firstInGroup={!sameAsOlder}
                lastInGroup={!sameAsNewer}
                chatMembers={members}
              />
            );
          })}
        </div>
        <div className={styles.composeContainer}>
          <textarea
            id="composer-textarea"
            rows={1}
            placeholder={t("chatRoom.placeholder")}
            onChange={(e) => {
              e.target.style.height = "";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter adds a new line
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className={`${styles.composer} noscroll`}
            ref={composerRef}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className={styles.sendButton}
            aria-label={t("chatRoom.send")}
          >
            <svg viewBox="0 0 24 24" className={styles.sendIcon} aria-hidden="true">
              <path
                d="M12 19V5M12 5l-6 6M12 5l6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

const MessageBubble = (props) => {
  const { t, formatDate } = useT();
  const user = useSelector((state) => state.auth.user);
  const usersData = useSelector((state) => state.data.users);
  const messageUser = usersData[props.user];
  const foreign = props.user !== user._id;
  const sentDate = new Date(props.sent);
  const isLastRead = props.id === props.lastReadID;
  const colourIndex =
    props.chatMembers &&
    props.chatMembers.map((u) => u._id || u).indexOf(props.user) % 5;
  const nameColour = nameColours[colourIndex] || nameColours[0];

  return (
    <div
      className={`${styles.bubbleRow} ${foreign ? styles.foreign : styles.own} ${
        props.lastInGroup ? styles.groupEnd : ""
      }`}
    >
      {isLastRead && (
        <div className={styles.lastReadIndicator}>{t("chatRoom.new")}</div>
      )}
      {foreign && props.firstInGroup && messageUser && (
        <div className={styles.bubbleUser} style={{ color: nameColour }}>
          {messageUser.first_name}
        </div>
      )}
      {props.activity?._id ? (
        <ActivityShareBubble activity={props.activity} foreign={foreign} />
      ) : null}
      {props.message ? (
        <div
          className={`${styles.bubble} ${
            props.lastInGroup ? styles.bubbleTail : ""
          }`}
        >
          {props.message}
        </div>
      ) : null}
      {props.lastInGroup && (
        <div className={styles.sent}>
          {t("chatRoom.sentAt", {
            date: formatDate(sentDate, { month: "short", day: "numeric" }),
            time: formatDate(sentDate, { timeStyle: "short" }),
          })}
        </div>
      )}
    </div>
  );
};

// A shared activity in the chat: tap to open the same activity popup as the
// social feed (Create Outing / Send to a friend)
const ActivityShareBubble = ({ activity, foreign }) => {
  const { t } = useT();
  const dispatch = useDispatch();
  const colour = useSelector(
    (state) => state.auth.globals?.categoryColorMap?.[activity.category]
  );
  const [loading, setLoading] = useState(false);
  const open = () => {
    if (loading) return;
    setLoading(true);
    fetchActivityDetails(activity._id, (full) => {
      setLoading(false);
      if (!full) return;
      dispatch(popupActions.setSharedActivity(full));
      dispatch(popupActions.showPopup("shared-activity"));
    });
  };
  return (
    <button
      type="button"
      onClick={open}
      className={`${styles.activityShare} ${
        foreign ? styles.activityShareForeign : ""
      }`}
    >
      {/* Straight category stripe, like the activity cards */}
      <span
        className={styles.activityShareStripe}
        style={{ backgroundColor: colour || undefined }}
      />
      <span className={styles.activityShareBody}>
        <span className={styles.activityShareLabel}>
          {loading ? t("chatRoom.share.opening") : t("chatRoom.share.activity")}
        </span>
        <span className={styles.activityShareName}>{activity.name}</span>
        {activity.location ? (
          <span className={styles.activityShareCity}>{activity.location}</span>
        ) : null}
      </span>
    </button>
  );
};

export default ChatModal;
