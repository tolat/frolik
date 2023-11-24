import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/AddUserModal.module.scss";
import modalStyles from "./styles/SlideInModal.module.scss";

import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import { goActions } from "../../store/go-slice";
import { Fragment, useEffect, useState } from "react";
import { fetchMatchedUsers } from "../../utils/data-fetch";

const AddUserModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "add-user" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [matchedUsers, setMatchedUsers] = useState([]);
  const fetchingMatchedUsers = useSelector(
    (state) => state.auth.fetchingMatchedUsers
  );
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
    const elt = document.getElementById(
      `${u.username}-friendCard-addUserModal`
    );
    elt.style.opacity = 0;
    setTimeout(() => {
      elt.style.padding = 0;
      elt.style.maxHeight = 0;
    }, 150);
    setTimeout(() => {
      elt.style.display = "none";
      dispatch(goActions.addUser(u));
    }, 300);
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

          {availableMatches[0] ? (
            availableMatches.map((u) => (
              <FriendCard
                id={`${u.username}-friendCard-addUserModal`}
                buttonSet={"add"}
                user={u}
                key={Math.random()}
                buttons={<AddButton user={u} />}
              />
            ))
          ) : fetchingMatchedUsers ? (
            <h2>Loading Matches..</h2>
          ) : (
            <h2>No Available Matches!</h2>
          )}
        </div>
        {availableFriends[0] ? (
          <Fragment>
            <h2 style={{ width: "100%" }}>Active Friends</h2>
            {availableFriends.map((f) => (
              <FriendCard
                buttonSet={"add"}
                user={f}
                key={Math.random()}
                buttons={<AddButton user={f} />}
              />
            ))}
          </Fragment>
        ) : (
          <h2 style={{ marginTop: "3rem" }}>No Friends Available!</h2>
        )}
      </div>
    </ModalPortal>
  );
};

export default AddUserModal;
