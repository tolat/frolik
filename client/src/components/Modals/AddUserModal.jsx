import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/AddUserModal.module.scss";
import modalStyles from "./styles/SlideInModal.module.scss";

import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import { goActions } from "../../store/go-slice";
import { useEffect, useState } from "react";
import { fetchMatchedUsers } from "../../utils/data-fetch";

const AddUserModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "add-user" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [matchedUsers, setMatchedUsers] = useState([]);
  const availableFriends = user.friends.filter(
    (f) =>
      (f.status.status === "Ready" || f.status.status === "Searching") &&
      !goState.outing.users.includes(f) &&
      f._id !== user._id
  );
  const availableMatches = matchedUsers.filter(
    (u) => !goState.outing.users.includes(u)
  );

  const addUserToOuting = (u) => {
    dispatch(goActions.addUser(u));
  };

  // Get matched users
  useEffect(() => {
    fetchMatchedUsers(user, setMatchedUsers);
  }, [user, setMatchedUsers]);

  const AddButton = (props) => {
    return (
      <div
        onClick={() => addUserToOuting(props.user)}
        className={styles.addButton}
      >
        +
      </div>
    );
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Add Outing Members</div>
        <div className={styles.dailyMatchesContainer}>
          <h2 className={styles.matchesHeader}>Daily Matches</h2>
          <div className={styles.headerSubtext}>
            These matches are random and will refresh every 24 hrs.
            <div style={{ marginTop: "0.2rem" }}>
              <b>Add at least one daily match to create an outing!</b>
            </div>
          </div>

          {availableMatches.map((u) => (
            <FriendCard
              buttonSet={"add"}
              user={u}
              key={Math.random()}
              buttons={<AddButton user={u} />}
            />
          ))}
        </div>
        <h2 style={{width: '100%'}}>Active Friends</h2>
        {availableFriends.map((f) => (
          <FriendCard
            buttonSet={"add"}
            user={f}
            key={Math.random()}
            buttons={<AddButton user={f} />}
          />
        ))}
      </div>
    </ModalPortal>
  );
};

export default AddUserModal;
