import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertPerson, useOpeners } from "./useAlertData";

// Unfriending closes the profile both ways, so this usually opens nothing
// (tapping just marks it read); it opens the profile only if you can still
// view it, e.g. you've since become friends again
const FriendRemoved = ({ notification }) => {
  const { t } = useT();
  const person = useAlertPerson(notification.by);
  const { openProfile, canOpenProfile } = useOpeners();

  return (
    <AlertTile
      notification={notification}
      title={t("notifications.headers.friendRemoved")}
      detail={person ? `${person.first_name} ${person.last_name}` : "…"}
      person={person}
      onOpen={canOpenProfile(person) ? () => openProfile(person) : null}
    />
  );
};

export default FriendRemoved;
