import { memo, useState, useRef, useCallback } from "react";
import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import {
  genMembersString,
  getUnreadChatMessages,
  setLastReadMessage,
} from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { fetchChat, deleteChat } from "../../utils/data-fetch";
import { chatActions } from "../../store/chat-slice";

const DELETE_ZONE_WIDTH = 80; // px revealed on left-swipe
const SNAP_THRESHOLD = DELETE_ZONE_WIDTH / 2;

const ChatCard = memo((props) => {
  const user = useSelector((state) => state.auth.user);
  const chat = props.chat;
  const globals = useSelector((state) => state.auth.globals);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getUnreadChatMessages(user, chat);

  // Swipe state — only enabled for non-outing chats
  const swipeEnabled = !chat?.outing;
  const [translateX, setTranslateX] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const pointerStartX = useRef(null);
  const startOffset = useRef(0);
  const totalMovePx = useRef(0);
  const isDragging = useRef(false);

  const memberNames = !chat
    ? ""
    : genMembersString(
        chat?.outing
          ? chat?.outing?.users.map((u) => u.first_name)
          : chat?.users?.map((u) => u.first_name)
      );

  const openChat = useCallback(() => {
    const onChatFetched = () => {
      dispatch(modalActions.setActiveChat(props.chat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
      setLastReadMessage();
    };
    fetchChat(user._id, props.chat._id, onChatFetched);
  }, [dispatch, props.chat, user._id]);

  const handleDelete = useCallback(() => {
    deleteChat(user, chat._id, () => {
      dispatch(chatActions.removeChat(chat._id));
    });
  }, [user, chat._id, dispatch]);

  // --- Pointer event handlers for swipe gesture ---

  const onPointerDown = useCallback(
    (e) => {
      if (!swipeEnabled) return;
      isDragging.current = true;
      pointerStartX.current = e.clientX;
      startOffset.current = translateX;
      totalMovePx.current = 0;
      setSnapping(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [swipeEnabled, translateX]
  );

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current || pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    totalMovePx.current = Math.abs(delta);
    const newX = Math.max(
      -DELETE_ZONE_WIDTH,
      Math.min(0, startOffset.current + delta)
    );
    setTranslateX(newX);
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      // Treat as a tap — open the chat
      if (totalMovePx.current < 5) {
        setSnapping(true);
        setTranslateX(0);
        openChat();
        return;
      }

      // Snap open or closed
      setSnapping(true);
      if (translateX < -SNAP_THRESHOLD) {
        setTranslateX(-DELETE_ZONE_WIDTH);
      } else {
        setTranslateX(0);
      }
    },
    [translateX, openChat]
  );

  // For outing chats (no swipe), use a plain click
  const handleOutingClick = useCallback(() => {
    openChat();
  }, [openChat]);

  return !chat ? null : (
    <div className={styles.outerContainer}>
      <div
        style={{
          backgroundColor: chat.outing
            ? globals.categoryColorMap[chat.outing.activity.category]
            : "lightgrey",
          width: chat.outing ? null : "0.5rem",
        }}
        className={styles.categoryStripe}
      ></div>

      <div className={styles.swipeClip}>
        {/* Delete zone revealed behind the card on left-swipe */}
        {swipeEnabled && (
          <div className={styles.deleteZone} onClick={handleDelete}>
            <span className={styles.deleteZoneText}>Delete</span>
          </div>
        )}

        <div
          onPointerDown={swipeEnabled ? onPointerDown : undefined}
          onPointerMove={swipeEnabled ? onPointerMove : undefined}
          onPointerUp={swipeEnabled ? onPointerUp : undefined}
          onClick={swipeEnabled ? undefined : handleOutingClick}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: snapping ? "transform 0.2s ease" : "none",
            ...props.style,
          }}
          className={styles.container}
        >
          {unreadChatMessages > 0 ? (
            <div className={styles.notificationBadge}>
              {unreadChatMessages > 0 && unreadChatMessages}
            </div>
          ) : null}
          <div className={styles.iconClusterContainer}>
            <UserIconCluster
              users={chat.outing ? chat.outing.users : chat.users}
              sizeInRem={8.5}
              borderSizeInRem={0.8}
            />
          </div>
          <div className={styles.leftSection}>
            <div>
              <div className={styles.name}>{chat.name}</div>
              {chat.outing && (
                <div className={styles.outingActivity}>
                  {chat.outing.activity.name}
                </div>
              )}
              <div
                className={`${styles.memberNames} ${
                  chat.outing ? null : styles.nonUserMembers
                }`}
              >
                {memberNames}
              </div>
            </div>
            <div className={styles.lastActive}>
              Last Active {new Date(chat.touched).toDateString().slice(4, 15)} -{" "}
              {new Date(chat.touched).toTimeString().slice(0, 5)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatCard;
