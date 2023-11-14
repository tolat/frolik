import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/FriendRemoved.module.scss";
import { useEffect } from "react";
import {
  dismissNotification,
  fetchPhotos,
  fetchProfilePic,
  fetchStrippedUser,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { toAppDate } from "../../utils/utils";
import SimpleButton from "../UI/SimpleButton";
import FriendCard from "../UI/FriendCard";
import { dataActions } from "../../store/data-slice";

const FriendRemoved = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const notification = props.notification;
  const cachedUsers = useSelector((state) => state.data.cachedUsers);
  const removingUser = cachedUsers.find((u) => u._id === notification.by);

  const handleDismissRequest = () => {
    const onComplete = (newUser) => {
      dispatch(authActions.setUser(newUser));
    };

    dismissNotification(user, props.notification, onComplete, null);
  };

  // Get requesting user and their data from server
  useEffect(() => {
    if (!removingUser) {
      const onComplete = (strippedUser) => {
        dispatch(dataActions.addCachedUser(strippedUser));
        fetchPhotos(strippedUser);
        fetchProfilePic(strippedUser._id);
      };
      fetchStrippedUser(notification.by, onComplete);
    }
  }, [notification, removingUser, dispatch]);

  return (
    removingUser && (
      <div className={styles.container}>
        <div className={styles.header}>You were unfriended by:</div>
        <FriendCard
          style={{ margin: "0" }}
          noShadow={true}
          small={true}
          user={removingUser}
        />
        <div>{toAppDate(props.notification.created)}</div>
        <div className={styles.buttons}>
          <SimpleButton
            className={styles.clearButton}
            onClick={() => handleDismissRequest()}
            noShadow={true}
          >
            {" "}
            Clear
          </SimpleButton>
        </div>
      </div>
    )
  );
};

export default FriendRemoved;
