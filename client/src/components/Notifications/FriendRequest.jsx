import { useDispatch, useSelector } from "react-redux";
import { dismissNotification, fetchMatchedUsers } from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertPerson, useOpeners } from "./useAlertData";

const FriendRequest = ({ notification }) => {
  const dispatch = useDispatch();
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const person = useAlertPerson(notification.from);
  const { openProfile, canOpenProfile } = useOpeners();

  const respond = (status) =>
    dismissNotification(
      user,
      notification,
      (newUser) => {
        dispatch(authActions.setUser(newUser));
        fetchMatchedUsers(newUser);
      },
      status
    );

  return (
    <AlertTile
      notification={notification}
      title={t("notifications.headers.friendRequest")}
      detail={person ? `${person.first_name} ${person.last_name}` : "…"}
      person={person}
      onOpen={canOpenProfile(person) ? () => openProfile(person) : null}
      actions={[
        { label: t("notifications.actions.accept"), primary: true, onClick: () => respond("accepted") },
        { label: t("notifications.actions.deny"), onClick: () => respond("denied") },
      ]}
    />
  );
};

export default FriendRequest;
