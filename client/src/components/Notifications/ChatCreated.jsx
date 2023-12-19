import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/ChatCreated.module.scss";
import { useEffect } from "react";
import {} from "../../store/data-actions";
import {
  dismissNotification,
  fetchChat,
  fetchPhotos,
  fetchProfilePic,
  fetchStrippedUser,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { toAppDate } from "../../utils/utils";
import SimpleButton from "../UI/SimpleButton";
import FriendCard from "../UI/FriendCard";
import { dataActions } from "../../store/data-slice";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";

const ChatCreated = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const notification = props.notification;
  const cachedUsers = useSelector((state) => state.data.cachedUsers);
  const creationUser = cachedUsers.find((u) => u._id === notification.by);
  const chats = useSelector((state) => state.chat.chats);
  const chat = chats?.find((c) => c._id === notification.chat);
  const modalVisible = useSelector((state) => state.modal.selector);

  const handleDismissRequest = () => {
    const onComplete = (newUser) => {
      dispatch(authActions.setUser(newUser));
    };

    dismissNotification(user, props.notification, onComplete, null);
  };

  // Get requesting user and their data from server
  useEffect(() => {
    if (!creationUser) {
      const onComplete = (strippedUser) => {
        dispatch(dataActions.addCachedUser(strippedUser));
        fetchPhotos(strippedUser);
        fetchProfilePic(strippedUser._id);
      };
      fetchStrippedUser(notification.by, onComplete);
    }
  }, [notification, creationUser, dispatch]);

  const handleViewChat = () => {
    const showChat = async (chatArg) => {
      if (modalVisible) await hideModal();
      dispatch(modalActions.setActiveChat(chatArg));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
    };
    !chat ? fetchChat(user._id, notification.chat, showChat) : showChat(chat);
  };

  return (
    creationUser && (
      <div className={styles.container}>
        <div className={styles.header}>You were added to a chat by:</div>
        <FriendCard
          style={{ margin: "0" }}
          noShadow={true}
          small={true}
          user={creationUser}
        />
        <div>{toAppDate(props.notification.created)}</div>
        <div className={styles.buttons}>
          <SimpleButton noShadow={true} onClick={handleViewChat}>
            View Chat
          </SimpleButton>
          <div className={styles.buttonSpacer}></div>
          <SimpleButton onClick={handleDismissRequest} noShadow={true}>
            Clear
          </SimpleButton>
        </div>
      </div>
    )
  );
};

export default ChatCreated;
