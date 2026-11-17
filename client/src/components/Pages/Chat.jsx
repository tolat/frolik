import { useDispatch, useSelector } from "react-redux";
import SkeletonCards from "../UI/SkeletonCards";
import styles from "./styles/Chat.module.scss";
import { dateSort, pageRouteLoader, toSorted } from "../../utils/utils";
import ChatCard from "../UI/ChatCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchChat } from "../../utils/data-fetch";
import { setLastReadMessage, getUnreadChatMessages } from "../../utils/utils";
import CreateChatModal from "../Modals/CreateChatModal";
import { modalActions } from "../../store/modal-slice";
import { onUpdateUser } from "../../store/socket-actions";

const Chat = memo((props) => {
  const chats = useSelector((state) => state.chat.chats);
  const user = useSelector((state) => state.auth.user);
  const fetchingChats = useSelector((state) => state.chat.fetchingChats);
  const [chatSearch, setChatSearch] = useState("");
  const dispatch = useDispatch();
  const [showArchived, setShowArchived] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const openChatID = searchParams.get("open");

  // /chat?open=<id> (from a notification tap) opens that chat directly
  useEffect(() => {
    if (!openChatID || !user?._id || !chats?.length) return;
    const chat = chats.find((c) => c._id === openChatID);
    setSearchParams({}, { replace: true });
    if (!chat) return;
    fetchChat(user._id, chat._id, () => {
      dispatch(modalActions.setActiveChat(chat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal());
      setLastReadMessage();
    });
  }, [openChatID, user?._id, chats, dispatch, setSearchParams]);
  const archivedIDs = new Set(user?.archived_chats || []);
  const validChats = applyChatSearch(
    chats?.filter((c) =>
      c.outing ? !c.outing.flakes.find((uid) => uid === user._id) : true
    )
  );

  // "Unread" filter
  const isUnread = (c) => user && getUnreadChatMessages(user, c) > 0;
  const unreadCount = validChats.filter(isUnread).length;
  const filteredChats = unreadOnly ? validChats.filter(isUnread) : validChats;

  // Archived Outing chats live in their own collapsible section
  const archivedChats = filteredChats.filter(
    (c) => c.outing && archivedIDs.has(c._id)
  );
  const activeChats = filteredChats.filter(
    (c) => !(c.outing && archivedIDs.has(c._id))
  );
  const sortChats = (list) =>
    toSorted(list, (a, b) => dateSort(b.touched, a.touched));

  const onCreateChat = () => {
    dispatch(modalActions.setSelector("create-chat-modal"));
    dispatch(modalActions.showModal());
  };


  function applyChatSearch(rawChats) {
    return chatSearch || chatSearch !== ""
      ? rawChats.filter((c) => {
          const chatUsers = c.outing ? c.outing.users : c.users;

          return (
            (c.name &&
              c.name
                .toLowerCase()
                .trim()
                .includes(chatSearch.toLowerCase().trim())) ||
            chatUsers.find(
              (u) =>
                u.first_name
                  ?.toLowerCase()
                  .trim()
                  .includes(chatSearch.toLowerCase().trim()) ||
                u.last_name
                  ?.toLowerCase()
                  .trim()
                  .includes(chatSearch.toLowerCase().trim())
            )
          );
        })
      : rawChats;
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <CreateChatModal />
        <div className={styles.searchRow}>
          <SimpleSearch
            style={{ marginBottom: 0 }}
            setValue={setChatSearch}
            defaultVal={""}
            placeholder={"Search Chats.."}
          />
          <SimpleButton
            onClick={onCreateChat}
            className={styles.newChatButton}
            data-tour="new-chat"
          >
            +
          </SimpleButton>
        </div>
        {!chats || (fetchingChats && !chats[0]) ? (
          <SkeletonCards variant="chat" count={4} />
        ) : !chats[0] ? (
          <div className={styles.noChatsMessage}>
            <h2 className={styles.noChatsMessageHeader}>Nothing to show yet!</h2>

            <div className={styles.noChatsMessageText}>
              You'll see your chats with friends and for specific Outings here.
            </div>
          </div>
        ) : (
          <div className={styles.chatsContainer}>
            <div className={styles.filterRow} role="tablist" aria-label="Filter chats">
              <button
                type="button"
                role="tab"
                aria-selected={!unreadOnly}
                className={`${styles.filterPill} ${!unreadOnly ? styles.filterPillActive : ""}`}
                onClick={() => setUnreadOnly(false)}
              >
                All
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={unreadOnly}
                className={`${styles.filterPill} ${unreadOnly ? styles.filterPillActive : ""}`}
                onClick={() => setUnreadOnly(true)}
              >
                Unread
                {unreadCount > 0 && (
                  <span className={styles.filterCount}>{unreadCount}</span>
                )}
              </button>
            </div>
            {unreadOnly && !activeChats.length && !archivedChats.length && (
              <div className={styles.filterEmpty}>You're all caught up — no unread chats.</div>
            )}
            {archivedChats.length > 0 && (
              <Fragment>
                <button
                  type="button"
                  className={`${styles.archivedToggle} ${
                    showArchived ? styles.archivedToggleOpen : ""
                  }`}
                  onClick={() => setShowArchived((v) => !v)}
                  aria-expanded={showArchived}
                >
                  <svg viewBox="0 0 24 24" className={styles.archivedIcon} aria-hidden="true">
                    <path
                      d="M3.5 7.5h17v-2a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1zM5 7.5v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-11M9.5 11.5h5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Archived
                  <span className={styles.archivedCount}>{archivedChats.length}</span>
                  <svg viewBox="0 0 24 24" className={styles.archivedChevron} aria-hidden="true">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {showArchived && (
                  <div className={styles.archivedList}>
                    {sortChats(archivedChats).map((c) => (
                      <ChatCard key={c._id} chat={c} archived />
                    ))}
                  </div>
                )}
              </Fragment>
            )}
            {sortChats(activeChats).map((c) => (
              <ChatCard key={c._id} chat={c} />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
});

export default Chat;

export const chatLoader = async () => {
  const redirect = await pageRouteLoader("/chat");
  if (redirect) {
    return redirect;
  }

  onUpdateUser();

  return null;
};
