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

  // Refs track gesture without triggering re-renders
  const pointerStartX = useRef(null);
  const startOffset = useRef(0);
  const totalMovePx = useRef(0);

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

  // --- Pointer event handlers ---
  // touch-action: pan-y on the container handles vertical scroll natively so
  // the browser never blocks on these handlers for vertical movement.

  const onPointerDown = useCallback(
    (e) => {
      if (!swipeEnabled) return;
      pointerStartX.current = e.clientX;
      startOffset.current = translateX;
      totalMovePx.current = 0;
      setSnapping(false);
    },
    [swipeEnabled, translateX]
  );

  const onPointerMove = useCallback((e) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    const absDeltaX = Math.abs(deltaX);
    if (absDeltaX < 4) return; // ignore tiny jitter

    // Capture the pointer on the first meaningful horizontal move so the
    // drag stays tracked even if the finger drifts off the element
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    totalMovePx.current = absDeltaX;
    const newX = Math.max(
      -DELETE_ZONE_WIDTH,
      Math.min(0, startOffset.current + deltaX)
    );
    setTranslateX(newX);
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      if (pointerStartX.current === null) return;
      const moved = totalMovePx.current;
      pointerStartX.current = null;
      totalMovePx.current = 0;

      if (moved < 5) {
        // Tap — open the chat
        openChat();
        return;
      }

      // Snap open or closed
      setSnapping(true);
      setTranslateX(translateX < -SNAP_THRESHOLD ? -DELETE_ZONE_WIDTH : 0);
    },
    [translateX, openChat]
  );

  // Browser cancelled our pointer (e.g. took over for scroll) — reset
  const onPointerCancel = useCallback(() => {
    pointerStartX.current = null;
    totalMovePx.current = 0;
    setSnapping(true);
    setTranslateX(0);
  }, []);

  // For outing chats (no swipe), use a plain click handler
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
        {/* Red delete zone revealed behind the card on left-swipe */}
        {swipeEnabled && (
          <div className={styles.deleteZone} onClick={handleDelete}>
            <span className={styles.deleteZoneText}>Delete</span>
          </div>
        )}

        <div
          onPointerDown={swipeEnabled ? onPointerDown : undefined}
          onPointerMove={swipeEnabled ? onPointerMove : undefined}
          onPointerUp={swipeEnabled ? onPointerUp : undefined}
          onPointerCancel={swipeEnabled ? onPointerCancel : undefined}
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
