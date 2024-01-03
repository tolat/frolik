import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/CreateChatModal.module.scss";
import { useEffect, useState } from "react";
import FriendCard from "../UI/FriendCard";
import SimpleSearch from "../UI/SimpleSearch";
import SimpleButton from "../UI/SimpleButton";
import { createChat, fetchChats } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { modalActions } from "../../store/modal-slice";
import { toSorted } from "../../utils/utils";
import ModalHeaderPortal from "./ModalHeaderPortal";
import ModalButtonPortal from "./ModalButtonPortal";

const CreateChatModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);
  const [newChatMembers, setNewChatMembers] = useState([]);
  const dispatch = useDispatch();

  // Initialize newChat Users
  useEffect(() => {
    if (user) {
      setNewChatMembers([user]);
    }
  }, [user]);

  const onAddMember = (m) => {
    setNewChatMembers((prevState) => [...prevState, m]);
  };

  const onRemoveMember = (m) => {
    setNewChatMembers((prevState) => prevState.filter((u) => u._id !== m._id));
  };

  const AddButton = (props) => {
    return (
      <div onClick={() => onAddMember(props.user)} className={styles.addButton}>
        +
      </div>
    );
  };

  const RemoveButton = (props) => {
    return (
      <div
        onClick={() => onRemoveMember(props.user)}
        className={styles.removeButton}
      >
        -
      </div>
    );
  };

  const onCreateChat = () => {
    const onComplete = async (response) => {
      await hideModal();
      fetchChats(user);
      dispatch(modalActions.setActiveChat(response.chat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal());
    };

    createChat(
      user,
      newChatMembers.filter((m) => m._id !== user._id),
      onComplete
    );
  };

  const [friendSearch, setFriendSearch] = useState("");

  function applyFriendSearch(friends) {
    return friendSearch || friendSearch !== ""
      ? user &&
          user.friends?.filter((f) => {
            return (
              f.first_name
                ?.toLowerCase()
                .trim()
                .includes(friendSearch.toLowerCase().trim()) ||
              f.last_name
                ?.toLowerCase()
                .trim()
                .includes(friendSearch.toLowerCase().trim())
            );
          })
      : user.friends;
  }

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <ModalHeaderPortal selector={"create-chat-modal"}>
          Create Chat
        </ModalHeaderPortal>
        <h2 className={styles.header}>New Chat Members:</h2>
        <ModalButtonPortal selector={"create-chat-modal"}>
          <SimpleButton
            onClick={newChatMembers.length === 1 ? null : onCreateChat}
            className={`${styles.createChatButton} ${
              newChatMembers.length === 1 ? styles.unclickableButton : null
            }`}
          >
            + Create Chat
          </SimpleButton>
        </ModalButtonPortal>
        {newChatMembers.map((m) => (
          <FriendCard
            buttonSet={"add"}
            user={m}
            key={Math.random() + Date.now()}
            buttons={m === user ? null : <RemoveButton user={m} />}
          />
        ))}
        <h2 className={styles.header}>Add Friends:</h2>
        <SimpleSearch
          placeholder={"Search Friends.."}
          setValue={setFriendSearch}
        />
        {toSorted(applyFriendSearch(user.friends), (a, b) => {
          if (a.first_name < b.first_name) {
            return -1;
          }
          if (a.first_name > b.first_name) {
            return 1;
          }
          return 0;
        })
          .filter((f) => !newChatMembers.find((m) => m._id === f._id))
          .map((f) => (
            <FriendCard
              buttonSet={"add"}
              user={f}
              key={Math.random() + Date.now()}
              buttons={<AddButton user={f} />}
            />
          ))}
      </div>
    </ModalPortal>
  );
};

export default CreateChatModal;
