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

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        {goState.outing.users.map((u) => (
          <FriendCard
            buttonSet={u._id === user._id ? "none" : "remove"}
            user={u}
            key={Math.random()}
            onClick={() => {
              removeUser(u);
            }}
          />
        ))}
      </div>
    </ModalPortal>
  );
};

export default EditUsersModal;
