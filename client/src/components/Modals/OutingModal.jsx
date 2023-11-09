import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/OutingModal.module.scss";
import SimpleButton from "../UI/SimpleButton";
import { Fragment } from "react";
import PhotoGrid from "../UI/PhotoGrid";
import photosIcon from "../../images/photos.png";
import activityIcon from "../../images/activity.png";
import membersIcon from "../../images/people.png";
import inviteIcon from "../../images/invite.png";
import FriendCard from "../UI/FriendCard";
import ActivityCard from "../UI/ActivityCard";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";
import {
  deleteOuting,
  fetchChat,
  fetchOuting,
  joinOuting,
  leaveOuting,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { popupActions } from "../../store/popup-slice";
import WarningPopup from "../Popups/WarningPopup";
import flakeIcon from "../../images/snowflake.png";

const OutingModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "outing-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const user = useSelector((state) => state.auth.user);
  const userData = useSelector((state) => state.data.users[user._id]);
  const dispatch = useDispatch();
  const activeOuting = useSelector((state) => state.modal.activeOuting);
  const outing =
    user?.outings?.find((o) => o._id === activeOuting._id) || activeOuting;
  const globals = useSelector((state) => state.auth.globals);
  const categoryColor = globals?.categoryColorMap[outing?.activity?.category];
  const completed = outing?.status === "Completed";
  const chatsState = useSelector((state) => state.chat.chats);
  const outingChat = chatsState.find((c) => c._id === outing?.chat);
  const joining = !!outing?.invited?.find((i) => i._id === user?._id);
  const isOnlyUser = outing?.users?.length < 2;
  const userFlaked = outing?.flakes?.find((id) => id === user._id);
  const activityIsCompletedType = user.outings?.find(
    (o) => o?.activity?._id === outing?.activity?._id
  );
  const photos = outing?.photos?.map(
    (p) => userData?.photos?.find((photo) => photo.key === p.key).photo
  );

  console.log(outing);

  // Handle the chat modal being shown
  const onShowChatModal = () => {
    const showChat = async () => {
      await hideModal();
      dispatch(modalActions.setActiveChat(outingChat));
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal());
    };
    fetchChat(user._id, outing?.chat, showChat);
  };

  const onOutingJoin = () => {
    const onComplete = (user) => {
      dispatch(authActions.setUser(user));

      // Fetch updated outing
      const onFetchOuting = (outing) => {
        dispatch(modalActions.setActiveOuting(outing));
        fetchChat(user._id, outing.chat, () => {});
      };
      fetchOuting(outing._id, user, onFetchOuting);
    };
    // Don't join if user has too many pending outings
    if (user.outings.filter((o) => o.status === "Pending").length >= 5) {
      dispatch(popupActions.showPopup("too-many-outings"));
      return;
    }

    joinOuting(user, outing, onComplete);
    dispatch(popupActions.hidePopup());
  };

  const onOutingLeave = () => {
    const onComplete = (user) => {
      dispatch(authActions.setUser(user));
      hideModal();
    };

    leaveOuting(user, outing, onComplete);
    dispatch(popupActions.hidePopup());
  };

  const onOutingDelete = () => {
    const onComplete = (user) => {
      dispatch(authActions.setUser(user));
      hideModal();
    };

    deleteOuting(user, outing, onComplete);
    dispatch(popupActions.hidePopup());
  };

  const showConfirmOutingDelete = () => {
    dispatch(popupActions.showPopup("confirm-delete-outing"));
  };

  const confirmDeleteOutingMessage = (
    <div className={styles.warningContainer}>
      <div className={styles.warningName}>{outing?.name}</div>
      <div className={styles.warningText}>
        Once you have deleted the Outing, it will no longer be joinable by any
        invitees. Deleting this Outing <b>will not</b> affect your flake rating.
        This action is permanent.
      </div>
    </div>
  );

  const showConfirmOutingLeave = () => {
    dispatch(popupActions.showPopup("confirm-leave-outing"));
  };

  const confirmLeaveOutingMessage = (
    <div className={styles.warningContainer}>
      <div className={styles.warningName}>{outing?.name}</div>
      <div className={styles.warningText}>
        Once you leave the Outing, it may still be completed by the other
        members. If it is, you <b>will negatively affect</b>affect your flake
        rating. This action is permanent (you cannot re-join after leaving).
      </div>
    </div>
  );

  const showConfirmOutingJoin = () => {
    dispatch(popupActions.showPopup("confirm-join-outing"));
  };

  const confirmJoinOutingMessage = (
    <div className={styles.warningContainer}>
      <div className={styles.warningName}>{outing?.name}</div>
      <div className={styles.warningText}>
        Once you join the Outing, it must be completed or deleted in order to
        maintain your flake rating. Outings can only be deleted while there is{" "}
        <b>one member</b> in the members list.
      </div>
    </div>
  );

  const onMarkCompleted = () => {};

  return !outing || !userData ? null : (
    <ModalPortal>
      <WarningPopup
        selector={"confirm-delete-outing"}
        header={"Confirm delete Outing:"}
        message={confirmDeleteOutingMessage}
        delete={"Delete"}
        deleteClick={onOutingDelete}
        cancel={"Cancel"}
        cancelClick={() => {
          dispatch(popupActions.hidePopup());
        }}
      />
      <WarningPopup
        selector={"confirm-join-outing"}
        header={"Confirm join Outing:"}
        message={confirmJoinOutingMessage}
        ok={"Join"}
        okClick={onOutingJoin}
        cancel={"Cancel"}
        cancelClick={() => {
          dispatch(popupActions.hidePopup());
        }}
      />
      <WarningPopup
        selector={"confirm-leave-outing"}
        header={"Confirm leave Outing:"}
        message={confirmLeaveOutingMessage}
        delete={"Leave"}
        deleteClick={onOutingLeave}
        cancel={"Cancel"}
        cancelClick={() => {
          dispatch(popupActions.hidePopup());
        }}
      />
      <div style={modalStyle} className={styles.container}>
        <div className={styles.header}>
          <div
            style={{ borderLeft: `10px solid ${categoryColor}` }}
            className={styles.headerInnerContainer}
          >
            <div className={styles.outingName}>{outing.name}</div>
            <div className={styles.outingStatus}>{outing.status}</div>
          </div>
        </div>
        <div className={styles.sideBySide}>
          {joining || userFlaked ? null : (
            <SimpleButton
              onClick={onShowChatModal}
              className={styles.chatButton}
            >
              Chat
            </SimpleButton>
          )}
          {!joining && !completed && !userFlaked ? (
            <div className={styles.buttonSpacer}></div>
          ) : null}

          {completed || userFlaked ? null : (
            <SimpleButton
              onClick={joining ? showConfirmOutingJoin : null}
              className={styles.completedButton}
            >
              {joining ? "Join Outing" : "Mark Completed"}
            </SimpleButton>
          )}
        </div>
        {userFlaked && (
          <Fragment>
            <div className={styles.flakeContainer}>
              <img className={styles.flakeIcon} src={flakeIcon} alt={"flake"} />
              <h1 className={styles.flakeText}>You flaked out!</h1>
            </div>
          </Fragment>
        )}
        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={activityIcon}
            alt={"activity"}
          />{" "}
          Activity
        </h2>
        <ActivityCard
          key={Math.random()}
          activity={outing.activity}
          completed={activityIsCompletedType}
          hideSelect={true}
        />
        {joining ? null : (
          <Fragment>
            <h2 className={styles.sectionHeader}>
              {" "}
              <img
                className={styles.sectionHeaderIcon}
                src={photosIcon}
                alt={"photos"}
              />{" "}
              <div className={styles.photosHeader}>
                Photos
                {!completed ? (
                  <div className={styles.photosHeaderText}>
                    Each member can upload up to 2 photos.
                  </div>
                ) : null}
              </div>
            </h2>
            {!completed ? (
              <SimpleButton className={styles.uploadPhotos}>
                + Upload
              </SimpleButton>
            ) : null}

            <div className={styles.photoGridContainer}>
              <PhotoGrid images={photos} gridTemplateColumns="1fr 1fr" />
            </div>
          </Fragment>
        )}

        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={membersIcon}
            alt={"members"}
          />{" "}
          Members
        </h2>
        {outing.users.map((u) => (
          <FriendCard user={u} key={Math.random()} />
        ))}
        {outing.invited[0] ? (
          <Fragment>
            <h2 className={styles.sectionHeader}>
              {" "}
              <img
                className={styles.sectionHeaderIcon}
                src={inviteIcon}
                alt={"invited"}
              />{" "}
              Invited
            </h2>
            {outing.invited.map((u) => (
              <FriendCard user={u} key={Math.random()} />
            ))}
          </Fragment>
        ) : null}

        {outing.status !== "Completed" &&
        !joining &&
        !outing.flakes.find((id) => id === user._id) ? (
          <Fragment>
            <SimpleButton
              onClick={
                isOnlyUser ? showConfirmOutingDelete : showConfirmOutingLeave
              }
              className={styles.leaveButton}
            >
              {isOnlyUser ? "Delete Outing" : "Leave Outing"}
            </SimpleButton>
            {isOnlyUser ? (
              <div className={styles.deleteHelp}>
                You can delete the outing becauase you are the only member.
                Deleting the outing <b>will not negatively affect</b> your flake
                rating.
              </div>
            ) : (
              <div className={styles.deleteHelp}>
                You cannot delete the outing becauase there are other members.
                Leaving the outing <b>will negatively affect</b> your flake
                rating.
              </div>
            )}
          </Fragment>
        ) : null}
      </div>
    </ModalPortal>
  );
};

export default OutingModal;
