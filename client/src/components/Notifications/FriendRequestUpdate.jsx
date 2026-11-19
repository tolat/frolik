import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertPerson, useOpeners } from "./useAlertData";

const FriendRequestUpdate = ({ notification }) => {
  const { t, tOr } = useT();
  const person = useAlertPerson(notification.from);
  const { openProfile, canOpenProfile } = useOpeners();
  const status = notification.status;

  return (
    <AlertTile
      notification={notification}
      title={tOr(
        `notifications.headers.friendRequestStatus.${status}`,
        t("notifications.headers.friendRequestStatus.other", { status })
      )}
      detail={person ? `${person.first_name} ${person.last_name}` : "…"}
      person={person}
      onOpen={canOpenProfile(person) ? () => openProfile(person) : null}
    />
  );
};

export default FriendRequestUpdate;
