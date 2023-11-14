import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingInvite.module.scss";
import { Fragment, useEffect } from "react";
import { dataActions } from "../../store/data-slice";
import { initializeUserPhotos } from "../../store/data-actions";
import { dismissNotification, fetchOuting } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { modalActions } from "../../store/modal-slice";
import { authActions } from "../../store/auth-slice";
import { toAppDate } from "../../utils/utils";
import SimpleButton from "../UI/SimpleButton";

const OutingInvite = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const outingID = props.notification.outing;
  const inviteOutings = useSelector((state) => state.data.inviteOutings);
  const outing = inviteOutings?.find((o) => o._id === outingID);
  const globals = useSelector((state) => state.auth.globals);
  const stripeColor = globals?.categoryColorMap[outing?.activity?.category];

  // Fetch outing from server if is hasn't been fetched
  useEffect(() => {
    const onComplete = (outing) => {
      dispatch(dataActions.addInviteOuting(outing));
      const newOutings = user.outings.concat([outing]);
      const newUser = { ...user, outings: newOutings };
      initializeUserPhotos(newUser);
    };

    if (!outing) {
      fetchOuting(outingID, user, onComplete);
    }
  }, [outingID, user, outing, dispatch]);

  // Show outing modal
  const handleViewOuting = async () => {
    await hideModal();
    dispatch(modalActions.setActiveOuting(outing));
    dispatch(modalActions.setSelector("outing-modal"));
    dispatch(modalActions.showModal());
  };

  const handleDismissInvite = () => {
    const onComplete = (user) => {
      dispatch(authActions.setUser(user));
    };

    dismissNotification(user, props.notification, onComplete, "denied");
  };

  return (
    <div className={styles.outingInviteContainer}>
      <div
        style={{ backgroundColor: stripeColor }}
        className={styles.colorStripe}
      ></div>
      <div className={styles.outingInviteInnerContainer}>
        <div className={styles.outingInviteHeader}>{props.header}</div>
        {outing ? (
          <Fragment>
            <div className={styles.outingInviteActivity}>
              {props.showOuting ? (
                <div>
                  Outing:<b> {outing.name} </b>
                </div>
              ) : (
                <div>
                  {" "}
                  Activity:<b> {outing.activity.name} </b>
                </div>
              )}
            </div>
            <div>{toAppDate(props.notification.created)}</div>
            <div className={styles.outingInviteButtons}>
              <SimpleButton noShadow={true} onClick={handleViewOuting}>
                {" "}
                View Outing
              </SimpleButton>
              <div className={styles.buttonSpacer}></div>
              <SimpleButton onClick={handleDismissInvite} noShadow={true}>
                {" "}
                Clear
              </SimpleButton>
            </div>
          </Fragment>
        ) : (
          "Loading.."
        )}
      </div>
    </div>
  );
};

export default OutingInvite;
