import store from "../../store";
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

const store_user = (fallback) => store.getState().auth.user || fallback;

const DELETE_ZONE_WIDTH = 96; // how far a short swipe opens the action
const SNAP_THRESHOLD = DELETE_ZONE_WIDTH / 2;
const ARM_DISTANCE = 150; // drag past this (with resistance) = do the action
const RESISTANCE = 0.45; // rubber-band factor beyond the open position

// Elastic drag: 1:1 up to the open position, then resists
const elastic = (raw, limit) =>
  Math.abs(raw) <= limit
    ? raw
    : Math.sign(raw) * (limit + (Math.abs(raw) - limit) * RESISTANCE);

const TRANSITIONS = {
  none: "none",
  snap: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
  bounce: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)", // springy return
  off: "transform 0.22s ease-in",
};
const AXIS_LOCK_PX = 8; // movement needed before deciding swipe vs scroll

const ChatCard = memo((props) => {
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
  const rootRef = useRef(null);
  // Swipe right (only when there's something unread) marks the chat read
  const canMarkRead = unreadChatMessages > 0;
  const maxRight = canMarkRead ? DELETE_ZONE_WIDTH : 0;
  const axis = useRef(null); // "x" | "y" | null — locked per gesture
  const [translateX, setTranslateX] = useState(0);
  // How the card animates when let go: snap open/closed, bounce back, slide off
  const [snapMode, setSnapMode] = useState("none");
  const [armed, setArmed] = useState(null); // "left" | "right" | null

  // Gesture state tracked in refs (no re-renders during drag)
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
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
      setSnapMode("none");
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
      if (axis.current === "x") e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (axis.current === "y") return;
    // Mark as a swipe so the follow-up click event gets suppressed.
    didSwipe.current = true;
    const raw = startOffset.current + deltaX;
    let newX;
    if (raw >= 0) {
      // Right = mark read; without anything unread just a tiny elastic tug
      newX = maxRightRef.current
        ? elastic(raw, DELETE_ZONE_WIDTH)
        : Math.min(raw * 0.12, 14);
    } else {
      newX = elastic(raw, DELETE_ZONE_WIDTH);
    }
    const nowArmed =
      newX <= -ARM_DISTANCE ? "left" : newX >= ARM_DISTANCE && maxRightRef.current ? "right" : null;
    setArmed((prev) => {
      if (nowArmed && nowArmed !== prev) navigator.vibrate?.(8); // tiny haptic on Android
      return nowArmed;
    });
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
      setArmed(null);

      // Right: a long swipe marks read; a peek just bounces back
      if (translateX > 0) {
        if (translateX >= ARM_DISTANCE && canMarkRead) markRead();
        setSnapMode("bounce");
        setTranslateX(0);
        return;
      }

      // Left: a long swipe does the action straight away (slide off first)
      if (translateX <= -ARM_DISTANCE) {
        setSnapMode("off");
        setTranslateX(-(rootRef.current?.offsetWidth || 400));
        setTimeout(handleSwipeAction, 200);
        return;
      }

      // Short swipe left: open to reveal the button (tap it to act)
      if (translateX < -SNAP_THRESHOLD) {
        setSnapMode(translateX < -DELETE_ZONE_WIDTH ? "bounce" : "snap");
        setTranslateX(-DELETE_ZONE_WIDTH);
        return;
      }
      setSnapMode("snap");
      setTranslateX(0);
    },
    [translateX, markRead, canMarkRead, handleSwipeAction]
  );

  // --- Click handler ---
  // Suppressed after a swipe; if the action is showing, a click closes it.
  const handleClick = useCallback(() => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    if (translateX !== 0) {
      setSnapMode("snap");
      setTranslateX(0);
      return;
    }
    openChat();
  }, [openChat, translateX]);

  return !chat ? null : (
    <div ref={rootRef} className={`${styles.outerContainer} fade-in`}>
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
        {canMarkRead && (
          <div
            className={`${styles.readZone} ${armed === "right" ? styles.zoneArmed : ""}`}
            style={{ opacity: translateX > 0 ? 1 : 0 }}
            aria-hidden="true"
          >
            <span className={styles.deleteZoneText}>✓ Read</span>
          </div>
        )}
        {swipeEnabled && (
          <div
            className={`${styles.deleteZone} ${
              swipeAction === "Delete" ? "" : styles.archiveZone
            } ${armed === "left" ? styles.zoneArmed : ""}`}
            style={{ opacity: translateX < 0 ? 1 : 0 }}
            onClick={handleSwipeAction}
          >
            <span className={styles.deleteZoneText}>{swipeAction}</span>
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
            transition: TRANSITIONS[snapMode],
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
