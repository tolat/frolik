import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import styles from "./styles/AddUserModal.module.scss";
import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import locationIcon from "../../images/location.png";
import { goActions } from "../../store/go-slice";

const AddUserModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "add-user" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const addUserToOuting = (u) => {
    dispatch(goActions.addUser(u));
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.newConnectionContainer}>
          <SimpleButton className={styles.newConnectionButton}>
            + Find New People
          </SimpleButton>
          <SimpleButton className={styles.radiusButton}>
            <img
              className={styles.locationIcon}
              src={locationIcon}
              alt="location"
            />
            10km
          </SimpleButton>
        </div>

        <h2>Friends:</h2>
        {user.friends.map((f) =>
          !goState.outing.users.find((u) => u._id === f._id) ? (
            <FriendCard
              buttonSet={"add"}
              user={f}
              key={Math.random()}
              onClick={() => {
                addUserToOuting(f);
              }}
            />
          ) : null
        )}
      </div>
    </ModalPortal>
  );
};

export default AddUserModal;
