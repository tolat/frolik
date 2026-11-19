import { useDispatch, useSelector } from "react-redux";
import { createChat, fetchChat, fetchChats } from "../../utils/data-fetch";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";
import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertPerson } from "./useAlertData";

const ChatCreated = ({ notification }) => {
  const dispatch = useDispatch();
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);
  const modalVisible = useSelector((state) => state.modal.selector);
  const person = useAlertPerson(notification.by);
  const chat = chats?.find((c) => c._id === notification.chat);

  const openChat = () => {
    const show = async (c) => {
      // selector is "none" (a truthy string) when nothing is open
      if (modalVisible && modalVisible !== "none") await hideModal();
      dispatch(modalActions.setActiveChat(c));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal({ headerStyle: { backgroundColor: "transparent" } }));
    };
    // The chat may have been deleted since: open a chat with the person who
    // added you instead (same as + Chat on their profile)
    const fallback = () => {
      if (!person) return;
      createChat(user, [person], (response) => {
        fetchChats(user);
        show(response.chat);
      });
    };
    chat ? show(chat) : fetchChat(user._id, notification.chat, show, fallback);
  };

  return (
    <AlertTile
      notification={notification}
      title={t("notifications.headers.chatCreated")}
      detail={person ? `${person.first_name} ${person.last_name}` : "…"}
      person={person}
      onOpen={openChat}
    />
  );
};

export default ChatCreated;
