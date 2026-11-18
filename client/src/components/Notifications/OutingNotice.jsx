import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingInvite.module.scss";
import { dismissNotification } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { modalActions } from "../../store/modal-slice";
import { authActions } from "../../store/auth-slice";
import { useT } from "../../i18n";
import SimpleButton from "../UI/SimpleButton";

// System alerts about an outing from the stale-outing job: reminders to join
// or mark completed, expired invites, removals, deletions for inactivity
// (server: utils/outingLifecycle.js). Text comes with the notification.
const OutingNotice = ({ notification: n }) => {
  const dispatch = useDispatch();
  const { t, formatDate } = useT();
  const user = useSelector((state) => state.auth.user);
  const outing = user?.outings?.find((o) => o._id === n.outing);
  const stripeColor = useSelector(
    (state) =>
      state.auth.globals?.categoryColorMap?.[outing?.activity?.category]
  );

  const handleViewOuting = async () => {
    await hideModal();
    dispatch(modalActions.setActiveOuting(outing));
    dispatch(modalActions.setSelector("outing-modal"));
    dispatch(
      modalActions.showModal({ headerStyle: { backgroundColor: "white" } })
    );
  };

  const handleClear = () =>
    dismissNotification(user, n, (u) => dispatch(authActions.setUser(u)));

  return (
    <div className={styles.outingInviteContainer}>
      <div
        style={{ backgroundColor: stripeColor || "#f2b84b" }}
        className={styles.colorStripe}
      ></div>
      <div className={styles.outingInviteInnerContainer}>
        <div className={styles.outingInviteHeader}>{n.title}</div>
        <div className={styles.outingInviteActivity}>{n.message}</div>
        <div>{formatDate(n.created, { dateStyle: "medium", timeStyle: "short" })}</div>
        <div className={styles.outingInviteButtons}>
          {outing ? (
            <>
              <SimpleButton noShadow={true} onClick={handleViewOuting}>
                {t("notifications.actions.viewOuting")}
              </SimpleButton>
              <div className={styles.buttonSpacer}></div>
            </>
          ) : null}
          <SimpleButton onClick={handleClear} noShadow={true}>
            {t("notifications.actions.clear")}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
};

export default OutingNotice;
