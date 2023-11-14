import { useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/CreateChatModal.module.scss";
import modalStyles from "./styles/SlideInModal.module.scss";
import AddUsersArea from "../UI/AddUsersArea";

const CreateChatModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-chat-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const onEditClick = () => {};

  const onAddClick = () => {};

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Create Chat</div>
        <AddUsersArea
          editButtonClassName={null}
          onAddClick={onAddClick}
          onEditClick={onEditClick}
          users={null}
        />
      </div>
    </ModalPortal>
  );
};

export default CreateChatModal;
