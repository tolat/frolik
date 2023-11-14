import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/FriendRequest.module.scss";
import { useEffect, useState } from "react";
import {} from "../../store/data-actions";
import {
  dismissNotification,
  fetchMatchedUsers,
  fetchPhotos,
  fetchProfilePic,
  fetchStrippedUser,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { toAppDate } from "../../utils/utils";
import SimpleButton from "../UI/SimpleButton";
import FriendCard from "../UI/FriendCard";
import { dataActions } from "../../store/data-slice";

const FriendRequest = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const notification = props.notification;
  const cachedUsers = useSelector((state) => state.data.cachedUsers);
  const requestingUser = cachedUsers.find((u) => u._id === notification.from);

  const handleDismissRequest = (status) => {
    const onComplete = (newUser) => {
      dispatch(authActions.setUser(newUser));
      fetchMatchedUsers(newUser)
    };

    dismissNotification(user, props.notification, onComplete, status);
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
        <div className={styles.header}>You have a friend request from:</div>
        <FriendCard
          style={{ margin: "0" }}
          noShadow={true}
          small={true}
          user={requestingUser}
        />
        <div>{toAppDate(props.notification.created)}</div>
        <div className={styles.buttons}>
          <SimpleButton
            noShadow={true}
            onClick={() => handleDismissRequest("accepted")}
            className={styles.acceptButton}
          >
            {" "}
            Accept
          </SimpleButton>
          <div className={styles.buttonSpacer}></div>
          <SimpleButton
            onClick={() => handleDismissRequest("denied")}
            noShadow={true}
          >
            {" "}
            Deny
          </SimpleButton>
        </div>
      </div>
    )
  );
};

export default FriendRequest;
