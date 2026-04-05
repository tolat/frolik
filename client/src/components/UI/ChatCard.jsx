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

const DELETE_ZONE_WIDTH = 80;
const SNAP_THRESHOLD = DELETE_ZONE_WIDTH / 2;

const ChatCard = memo((props) => {
  const user = useSelector((state) => state.auth.user);
  const chat = props.chat;
  const globals = useSelector((state) => state.auth.globals);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getUnreadChatMessages(user, chat);

  // Swipe is only active on non-outing chats
  const swipeEnabled = !chat?.outing;
  const [translateX, setTranslateX] = useState(0);
  const [snapping, setSnapping] = useState(false);

  // Gesture state tracked in refs (no re-renders during drag)
  const touchStartX = useRef(null);
  const startOffset = useRef(0);
  const didSwipe = useRef(false); // blocks the synthetic click after a swipe

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

  // --- Touch handlers (mobile swipe) ---
  // Using onTouch* keeps these completely separate from mouse events so
  // desktop scroll (wheel, scrollbar drag) is never interrupted.

  const onTouchStart = useCallback(
    (e) => {
      if (!swipeEnabled) return;
      touchStartX.current = e.touches[0].clientX;
      startOffset.current = translateX;
      didSwipe.current = false;
      setSnapping(false);
    },
    [swipeEnabled, translateX]
  );

  const onTouchMove = useCallback((e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    // Mark as a swipe once there's meaningful horizontal movement so the
    // follow-up synthetic click event gets suppressed.
    if (Math.abs(deltaX) > 8) didSwipe.current = true;
    const newX = Math.max(-DELETE_ZONE_WIDTH, Math.min(0, startOffset.current + deltaX));
    setTranslateX(newX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;
    touchStartX.current = null;

    if (!didSwipe.current) return; // let the synthetic click handle the tap

    setSnapping(true);
    setTranslateX(translateX < -SNAP_THRESHOLD ? -DELETE_ZONE_WIDTH : 0);
  }, [translateX]);

  // --- Click handler (works on both desktop and mobile) ---
  // Suppressed after a swipe so the card doesn't open when the user swipes.
  const handleClick = useCallback(() => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
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
        {swipeEnabled && (
          <div className={styles.deleteZone} onClick={handleDelete}>
            <span className={styles.deleteZoneText}>Delete</span>
          </div>
        )}

        <div
          onTouchStart={swipeEnabled ? onTouchStart : undefined}
          onTouchMove={swipeEnabled ? onTouchMove : undefined}
          onTouchEnd={swipeEnabled ? onTouchEnd : undefined}
          onClick={handleClick}
          style={{
            transform: translateX !== 0 ? `translateX(${translateX}px)` : undefined,
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
