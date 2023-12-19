import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/EditUsersModal.module.scss";
import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import { goActions } from "../../store/go-slice";
import ModalHeaderPortal from "./ModalHeaderPortal";

const EditUsersModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "edit-users" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const removeUser = (u) => {
    const id = u._id || u;
    if (id !== user._id) {
      const elt = document.getElementById(`${id}-friendCard-removeUserModal`);
      elt.style.opacity = 0;
      setTimeout(() => {
        elt.style.padding = 0;
        elt.style.maxHeight = 0;
      }, 150);
      setTimeout(() => {
        elt.style.display = "none";
        dispatch(goActions.removeUser(u));
      }, 300);
    }
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
        <ModalHeaderPortal selector={"edit-users"}>
          Remove Outing Members
        </ModalHeaderPortal>
        {goState.outing.users.map((u) => (
          <FriendCard
            id={`${u._id || u}-friendCard-removeUserModal`}
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
