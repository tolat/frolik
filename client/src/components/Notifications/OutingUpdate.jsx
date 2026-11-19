import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertOuting, useAlertPerson, useOpeners } from "./useAlertData";

// Someone joined / left / accepted / declined / marked complete an outing
const OutingUpdate = ({ notification, header }) => {
  const { t } = useT();
  const outing = useAlertOuting(notification.outing);
  const person = useAlertPerson(notification.userID, outing);
  const { openOuting } = useOpeners();
  const name = person ? `${person.first_name} ${person.last_name}` : "…";

  return (
    <AlertTile
      notification={notification}
      title={header}
      detail={outing ? `${name} · ${outing.name}` : `${name} · ${t("notifications.outingLoading")}`}
      person={person}
      onOpen={() => openOuting(outing)}
    />
  );
};

export default OutingUpdate;
