import { useSelector } from "react-redux";
import AlertTile from "./AlertTile";
import { useCategoryColor, useOpeners } from "./useAlertData";

// System alerts about an outing from the stale-outing job: reminders to join
// or mark completed, expired invites, removals, deletions for inactivity
// (server: utils/outingLifecycle.js). Text comes with the notification.
const OutingNotice = ({ notification: n }) => {
  const user = useSelector((state) => state.auth.user);
  const outing = user?.outings?.find((o) => o._id === n.outing);
  const color = useCategoryColor(outing);
  const { openOuting } = useOpeners();

  return (
    <AlertTile
      notification={n}
      title={n.title}
      detail={n.message}
      color={color || "#f7d58f"}
      onOpen={outing ? () => openOuting(outing) : null}
    />
  );
};

export default OutingNotice;
