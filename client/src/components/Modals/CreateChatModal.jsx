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
import { alphabetSort, toSorted } from "../../utils/utils";
import ModalHeaderPortal from "./ModalHeaderPortal";
import ModalButtonPortal from "./ModalButtonPortal";

const CreateChatModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);
  // Friends picked for the chat. You're always in it, so you aren't listed.
  const [newChatMembers, setNewChatMembers] = useState([]);
  const dispatch = useDispatch();
  const isOpen = modalState.selector === "create-chat-modal";
  const canCreate = newChatMembers.length >= 1; // you + at least one friend

  // Start fresh each time the panel opens
  useEffect(() => {
    if (isOpen) {
      setNewChatMembers([]);
    }
  }, [isOpen]);

  const onAddMember = (m) => {
    setNewChatMembers((prevState) =>
      prevState.some((u) => u._id === m._id) ? prevState : [...prevState, m]
    );
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

    if (!canCreate) return;
    createChat(user, newChatMembers, onComplete);
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
        <ModalButtonPortal selector={"create-chat-modal"}>
          <SimpleButton
            onClick={canCreate ? onCreateChat : null}
            className={`${styles.createChatButton} ${
              canCreate ? "" : styles.unclickableButton
            }`}
          >
            + Create Chat
          </SimpleButton>
        </ModalButtonPortal>
        {canCreate ? (
          <>
            <h2 className={styles.header}>Chat with:</h2>
            {newChatMembers.map((m) => (
              <FriendCard
                buttonSet={"add"}
                user={m}
                key={m._id}
                buttons={<RemoveButton user={m} />}
              />
            ))}
          </>
        ) : (
          <div className={styles.pickHint}>
            Add at least one friend to start a chat.
          </div>
        )}
        <h2 className={styles.header}>Add Friends:</h2>
        <SimpleSearch
          placeholder={"Search Friends.."}
          setValue={setFriendSearch}
        />
        {toSorted(applyFriendSearch(user.friends), alphabetSort)
          .filter((f) => !newChatMembers.find((m) => m._id === f._id))
          .map((f) => (
            <FriendCard
              buttonSet={"add"}
              user={f}
              key={f._id}
              buttons={<AddButton user={f} />}
            />
          ))}
      </div>
    </ModalPortal>
  );
};

export default CreateChatModal;
