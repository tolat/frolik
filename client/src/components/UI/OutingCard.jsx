import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { modalActions } from "../../store/modal-slice";
import { outingIsCompleted, outingStatus } from "../../utils/utils";
import { useT } from "../../i18n";
import flakeIcon from "../../images/snowflake.png";

const OutingCard = memo((props) => {
  const { t, formatDate } = useT();
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = useSelector(
    (state) => state.auth.globals.categoryColorMap
  );
  const o = props.outing;
  const completed = o && outingIsCompleted(o);
  const status = completed ? "Completed" : "Pending";
  const progress = completed ? null : outingStatus(o, user);
  const dispatch = useDispatch();
  const userFlaked = o.flakes.find((id) => id === user._id);

  const handleClick = () => {
    dispatch(modalActions.setActiveOuting(o));
    dispatch(modalActions.setSelector("outing-modal"));
    dispatch(modalActions.showModal({
      headerStyle: { backgroundColor: "white" },
    }));
  };

  return !categoryColorMap ? null : (
    <div style={props.style} className={`${styles.outerContainer} fade-in`}>
      <div
        style={{ backgroundColor: categoryColorMap[o.activity?.category] }}
        className={styles.categoryStripe}
      ></div>
      <div
        onClick={handleClick}
        className={styles.innerContainer}
      >
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.nameActivityContainer}>
              <div className={styles.activity}>{o.activity?.name}</div>
              <div className={styles.name}>{o.name}</div>
            </div>
            {/* Flaked: a pill with the app's flake icon (the whole card used
                to turn pink) */}
            {userFlaked ? (
              <div className={`${styles.progress} ${styles.flakePill}`}>
                <img src={flakeIcon} alt="" className={styles.flakePillIcon} />
                {t("ui.outingStatus.youLeft")}
              </div>
            ) : progress && (
              <div
                className={`${styles.progress} ${
                  progress.ready ? styles.progressReady : styles.progressWaiting
                }`}
              >
                {progress.label}
              </div>
            )}

            <div className={styles.status}>
              {t(`ui.outingCard.${status === "Completed" ? "completed" : "pending"}`, {
                date: formatDate(completed ? o.date_completed : o.date_created, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              })}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
            <UserIconCluster
              users={o.users}
              sizeInRem={8.5}
              borderSizeInRem={0.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default OutingCard;
