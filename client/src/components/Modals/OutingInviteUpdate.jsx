import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingInviteUpdate.module.scss";
import { Fragment, useEffect } from "react";
import { dataActions } from "../../store/data-slice";
import { initializeUserPhotos } from "../../store/data-actions";
import { dismissNotification, fetchOuting, fetchProfilePic, fetchStrippedUser } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { modalActions } from "../../store/modal-slice";
import { authActions } from "../../store/auth-slice";
import { toAppDate } from "../../utils/utils";
import SimpleButton from "../UI/SimpleButton";
import FriendCard from "../UI/FriendCard";


const OutingInviteUpdate = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const outingID = props.notification.outing;
    const inviteOutings = useSelector((state) => state.data.inviteOutings);
    const outing = inviteOutings?.find((o) => o._id === outingID);
    const globals = useSelector((state) => state.auth.globals);
    const stripeColor = globals?.categoryColorMap[outing?.activity?.category];
    const cachedUsers = useSelector((state) => state.data.cachedUsers);
    const n = props.notification;
    const nUserID = n.userID;
    const nUserData = useSelector((state) => state.data.users[nUserID]);
    const nUser =
      outing?.users.find((u) => u._id === nUserID) ||
      cachedUsers.find((u) => u._id === nUserID);
  
    // Fetch notification user from server
    useEffect(() => {
      if (!nUserData) {
        fetchProfilePic(nUserID);
      }
    }, [nUserID, nUserData]);
  
    // Fetch notification user form server if it is not in outing (user denied invite)
    useEffect(() => {
      if (!nUser) {
        const onComplete = (fetchedUser) => {
          dispatch(dataActions.addCachedUser(fetchedUser));
        };
        fetchStrippedUser(nUserID, onComplete);
      }
    });
  
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
  
    const handleDeleteInvite = () => {
      const onComplete = (user) => {
        dispatch(authActions.setUser(user));
      };
  
      dismissNotification(user, props.notification, onComplete);
    };
  
    return (
      <div className={styles.outingInviteContainer}>
        <div
          style={{ backgroundColor: stripeColor }}
          className={styles.colorStripe}
        ></div>
        <div className={styles.outingInviteInnerContainer}>
          <div className={styles.outingInviteHeader}>
            {n.status === "denied"
              ? `Your Outing invite has been denied by:`
              : `Your Outing invite has been accepted by: `}
            {nUser ? (
              <FriendCard noShadow={true} key={Math.random()} user={nUser} />
            ) : (
              <h5>Loading User..</h5>
            )}
          </div>
          {outing ? (
            <Fragment>
              <div className={styles.outingInviteActivity}>
                Outing: <b>{outing.name}</b>
              </div>
              <div>{toAppDate(n.created)}</div>
              <div className={styles.outingInviteButtons}>
                <SimpleButton noShadow={true} onClick={handleViewOuting}>
                  {" "}
                  View Outing
                </SimpleButton>
                <div className={styles.buttonSpacer}></div>
                <SimpleButton onClick={handleDeleteInvite} noShadow={true}>
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

  export default OutingInviteUpdate