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

  const removeUser = (u) => {
    if (u._id !== user._id) dispatch(goActions.removeUser(u));
  };

  const RemoveButton = (props) => {
    return (
      <div
        onClick={() => removeUser(props.user)}
        className={styles.removeButton}
      >
        -
      </div>
    );
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        {goState.outing.users.map((u) => (
          <FriendCard
            user={u}
            key={Math.random()}
            buttons={u._id === user._id ? null : <RemoveButton user={u} />}
          />
        ))}
      </div>
    </ModalPortal>
  );
};

export default EditUsersModal;
