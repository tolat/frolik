import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/EditUsersModal.module.scss";
import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import { goActions } from "../../store/go-slice";

const EditUsersModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "edit-users" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const removeUser = (id) => {
    if (id !== user._id) dispatch(goActions.removeUser(id));
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        {goState.users.map((id) => (
          <FriendCard
            buttonSet={id === user._id ? "none" : "remove"}
            userID={id}
            key={Math.random()}
            onClick={() => {
              removeUser(id);
            }}
          />
        ))}
      </div>
    </ModalPortal>
  );
};

export default EditUsersModal;
