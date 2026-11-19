import { useDispatch, useSelector } from "react-redux";
import { dismissNotification } from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { useT } from "../../i18n";
import AlertTile from "./AlertTile";
import { useAlertOuting, useCategoryColor, useOpeners } from "./useAlertData";

// An invite (Decline here, or open the outing to join) or a completed outing
// Invite answers as they read on the tile
const INVITE_TAG = { accepted: "joined", denied: "declined", expired: "expired" };

const OutingInvite = ({ notification, header, showOuting, canDecline }) => {
  const status = notification.status;
  const answered = canDecline && !!status;
  const dispatch = useDispatch();
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const outing = useAlertOuting(notification.outing);
  const color = useCategoryColor(outing);
  const { openOuting } = useOpeners();

  const decline = () =>
    dismissNotification(user, notification, (u) => dispatch(authActions.setUser(u)), "denied");

  return (
    <AlertTile
      notification={notification}
      title={header}
      detail={
        outing
          ? showOuting
            ? outing.name
            : `${outing.activity?.name || ""} · ${outing.name}`
          : t("notifications.outingLoading")
      }
      color={color}
      // A declined or expired invite has nothing to open any more
      onOpen={answered && status !== "accepted" ? null : () => openOuting(outing)}
      tag={answered ? t(`notifications.status.${INVITE_TAG[status] || status}`) : null}
      actions={
        canDecline && !answered
          ? [{ label: t("notifications.actions.decline"), onClick: decline }]
          : null
      }
    />
  );
};

export default OutingInvite;
