import store from "../../store";
import { memo, useState, useRef, useCallback } from "react";
import styles from "./styles/ChatCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import {
  genMembersString,
  getUnreadChatMessages,
  setLastReadMessage,
  toAppDate,
} from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import {
  fetchChat,
  deleteChat,
  archiveChat,
  fetchChats,
  updateChatLastRead,
} from "../../utils/data-fetch";
import { fetchAuth } from "../../store/auth-actions";
import { authActions } from "../../store/auth-slice";
import { collapseOut } from "../../utils/animations";
import { chatActions } from "../../store/chat-slice";
import { useT } from "../../i18n";

const store_user = (fallback) => store.getState().auth.user || fallback;

const DELETE_ZONE_WIDTH = 96; // swipe opens the card this far to show a button
const SNAP_THRESHOLD = DELETE_ZONE_WIDTH / 2;
const AXIS_LOCK_PX = 8; // movement needed before deciding swipe vs scroll

const ChatCard = memo((props) => {
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const chat = props.chat;
  const globals = useSelector((state) => state.auth.globals);
  const dispatch = useDispatch();
  const unreadChatMessages = user && getUnreadChatMessages(user, chat);

  // Swipe reveals Delete on regular chats, Archive/Unarchive on Outing chats
  const swipeEnabled = !!chat;
  const swipeAction = chat?.outing
    ? props.archived
      ? "Unarchive"
      : "Archive"
    : "Delete";
  const swipeActionLabel = {
    Delete: t("ui.chatCard.delete"),
    Archive: t("ui.chatCard.archive"),
    Unarchive: t("ui.chatCard.unarchive"),
  }[swipeAction];
  const rootRef = useRef(null);
  // Swipe right (only when there's something unread) marks the chat read
  const canMarkRead = unreadChatMessages > 0;
  const maxRight = canMarkRead ? DELETE_ZONE_WIDTH : 0;
  const axis = useRef(null); // "x" | "y" | null — locked per gesture
  const [translateX, setTranslateX] = useState(0);
  const [snapping, setSnapping] = useState(false);

  // Gesture state tracked in refs (no re-renders during drag)
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const startOffset = useRef(0);
  const didSwipe = useRef(false); // blocks the synthetic click after a swipe

  // Other members only — your own name isn't needed on your own chat list
  const otherMembers = (
    (chat?.outing ? chat?.outing?.users : chat?.users) || []
  ).filter((u) => (u?._id || u) !== user?._id);
  const memberNames = !chat
    ? ""
    : otherMembers.length
    ? genMembersString(otherMembers.map((u) => u.first_name))
    : t("ui.chatCard.justYou");

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

  // Smoothly collapse the card, then run `done` (which removes/moves it)
  const collapseThen = useCallback(
    (done) => collapseOut(rootRef.current, done, { duration: 300 }),
    []
  );

  const handleSwipeAction = useCallback(() => {
    if (swipeAction === "Delete") {
      deleteChat(user, chat._id, () =>
        collapseThen(() => dispatch(chatActions.removeChat(chat._id)))
      );
      return;
    }
    const archive = swipeAction === "Archive";
    archiveChat(user, chat._id, archive, (response) =>
      collapseThen(() =>
        dispatch(
          authActions.setUser({
            ...store_user(user),
            archived_chats: response.archived_chats,
          })
        )
      )
    );
  }, [swipeAction, user, chat._id, dispatch, collapseThen]);

  const maxRightRef = useRef(maxRight);
  maxRightRef.current = maxRight;

  const markRead = useCallback(() => {
    const latest = chat?.messages?.[0];
    if (!latest) return;
    updateChatLastRead(user, chat, latest.id, () => {
      fetchChats(user);
      fetchAuth(); // refresh the Chats badge in the nav bar
    });
  }, [user, chat]);

  // --- Swipe handlers (pointer events: touch AND mouse drag on desktop) ---
  // `touch-action: pan-y` on the card (CSS) keeps vertical scrolling native
  // on touch screens; a vertical scroll fires pointercancel, ending the drag.

  const onPointerDown = useCallback(
    (e) => {
      if (!swipeEnabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      touchStartX.current = e.clientX;
      touchStartY.current = e.clientY;
      axis.current = null;
      startOffset.current = translateX;
      didSwipe.current = false;
      setSnapping(false);
    },
    [swipeEnabled, translateX]
  );

  const onPointerMove = useCallback((e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.clientX - touchStartX.current;
    const deltaY = e.clientY - touchStartY.current;
    // Lock to one axis per gesture so vertical scrolling never drags the card
    if (!axis.current) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < AXIS_LOCK_PX) return;
      axis.current = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      // Keep receiving moves even if the pointer leaves the card
      // (throws if the pointer already ended, e.g. a fast flick; harmless)
      if (axis.current === "x") {
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {}
      }
    }
    if (axis.current === "y") return;
    // Mark as a swipe so the follow-up click event gets suppressed.
    didSwipe.current = true;
    // Left reveals Archive/Delete; right reveals "Read" (only when unread)
    const newX = Math.max(
      -DELETE_ZONE_WIDTH,
      Math.min(maxRightRef.current, startOffset.current + deltaX)
    );
    setTranslateX(newX);
  }, []);

  const onPointerEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      touchStartX.current = null;
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (!didSwipe.current) return; // let the click handler handle the tap

      // Snap open to show the button (tap it to act), or closed
      setSnapping(true);
      if (translateX > SNAP_THRESHOLD) setTranslateX(DELETE_ZONE_WIDTH);
      else if (translateX < -SNAP_THRESHOLD) setTranslateX(-DELETE_ZONE_WIDTH);
      else setTranslateX(0);
    },
    [translateX]
  );

  // --- Click handler ---
  // Suppressed after a swipe; if the action is showing, a click closes it.
  const handleClick = useCallback(() => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    if (translateX !== 0) {
      setSnapping(true);
      setTranslateX(0);
      return;
    }
    openChat();
  }, [openChat, translateX]);

  return !chat ? null : (
    <div ref={rootRef} className={`${styles.outerContainer} fade-in`}>
      {/* Category colour bar for outing chats only; DMs have none */}
      {chat.outing ? (
        <div
          style={{
            backgroundColor:
              globals.categoryColorMap[chat.outing.activity.category],
          }}
          className={styles.categoryStripe}
        ></div>
      ) : null}

      <div className={styles.swipeClip}>
        {canMarkRead && (
          <div
            className={styles.readZone}
            style={{ opacity: translateX > 0 ? 1 : 0 }}
            onClick={() => {
              markRead();
              setSnapping(true);
              setTranslateX(0);
            }}
          >
            <span className={styles.deleteZoneText}>{t("ui.chatCard.markRead")}</span>
          </div>
        )}
        {swipeEnabled && (
          <div
            className={`${styles.deleteZone} ${
              swipeAction === "Delete" ? "" : styles.archiveZone
            }`}
            style={{ opacity: translateX < 0 ? 1 : 0 }}
            onClick={handleSwipeAction}
          >
            <span className={styles.deleteZoneText}>{swipeActionLabel}</span>
          </div>
        )}

        <div
          onPointerDown={swipeEnabled ? onPointerDown : undefined}
          onPointerMove={swipeEnabled ? onPointerMove : undefined}
          onPointerUp={swipeEnabled ? onPointerEnd : undefined}
          onPointerCancel={swipeEnabled ? onPointerEnd : undefined}
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
              {t("ui.chatCard.lastActive", { date: toAppDate(chat.touched) })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatCard;
