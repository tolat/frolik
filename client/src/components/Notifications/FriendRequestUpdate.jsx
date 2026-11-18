import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/FriendRequestUpdate.module.scss";
import { useEffect } from "react";
import {} from "../../store/data-actions";
import {
  dismissNotification,
  fetchMatchedUsers,
  fetchPhotos,
  fetchProfilePic,
  fetchStrippedUser,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { useT } from "../../i18n";
import SimpleButton from "../UI/SimpleButton";
import FriendCard from "../UI/FriendCard";
import { dataActions } from "../../store/data-slice";

const FriendRequestUpdate = (props) => {
  const dispatch = useDispatch();
  const { t, tOr, formatDate } = useT();
  const user = useSelector((state) => state.auth.user);
  const notification = props.notification;
  const cachedUsers = useSelector((state) => state.data.cachedUsers);
  const requestingUser = cachedUsers.find((u) => u._id === notification.from);
  const status = notification.status;

  const handleDismissRequest = () => {
    const onComplete = (user) => {
      dispatch(authActions.setUser(user));
      fetchMatchedUsers()
    };

    dismissNotification(user, props.notification, onComplete, null);
  };

  // Get requesting user and their data from server
  useEffect(() => {
    if (!requestingUser) {
      const onComplete = (strippedUser) => {
        dispatch(dataActions.addCachedUser(strippedUser));
        fetchPhotos(strippedUser);
        fetchProfilePic(strippedUser._id);
      };
      fetchStrippedUser(notification.from, onComplete);
    }
  }, [notification, requestingUser, dispatch]);

  return (
    requestingUser && (
      <div className={styles.container}>
        <div className={styles.header}>
          {tOr(
            `notifications.headers.friendRequestStatus.${status}`,
            t("notifications.headers.friendRequestStatus.other", { status })
          )}
        </div>
        <FriendCard
          style={{ margin: "0" }}
          noShadow={true}
          small={true}
          user={requestingUser}
        />
        <div>{formatDate(props.notification.created, { dateStyle: "medium", timeStyle: "short" })}</div>
        <div className={styles.buttons}>
          <SimpleButton onClick={() => handleDismissRequest()} noShadow={true}>
            {t("notifications.actions.clear")}
          </SimpleButton>
        </div>
      </div>
    )
  );
};

export default FriendRequestUpdate;
