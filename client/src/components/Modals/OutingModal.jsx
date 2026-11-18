import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/OutingModal.module.scss";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useState, useRef } from "react";
import photosIcon from "../../images/photos.png";
import activityIcon from "../../images/activity.png";
import membersIcon from "../../images/people.png";
import inviteIcon from "../../images/invite.png";
import FriendCard from "../UI/FriendCard";
import ActivityCard from "../UI/ActivityCard";
import { modalActions } from "../../store/modal-slice";
import { hideModal, swapModal } from "../../store/modal-actions";
import { resetViewportShift } from "../../utils/pageScroll";
import { fileToResizedDataURL } from "../../utils/imageResize";
import {
  addOutingCompletion,
  deleteOuting,
  deleteOutingPhoto,
  fetchChat,
  fetchOuting,
  fetchPhotos,
  joinOuting,
  leaveOuting,
  uploadOutingPhoto,
} from "../../utils/data-fetch";
import { authActions } from "../../store/auth-slice";
import { popupActions } from "../../store/popup-slice";
import WarningPopup from "../Popups/WarningPopup";
import OutingTitleEditor from "../UI/OutingTitleEditor";
import flakeIcon from "../../images/snowflake.png";
import {
  outingIsCompleted,
  userIsLastCompletion,
} from "../../utils/utils";
import { fetchAuth } from "../../store/auth-actions";
import CropperPopup from "../Popups/CropperPopup";
import addPhotosButton from "../../images/add-photos-button.png";
import StarRate from "../UI/StarRate";
import FeedCard from "../UI/FeedCard";
import SixPhotoGrid from "../UI/SixPhotoGrid";
import ModalHeaderPortal from "./ModalHeaderPortal";

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
  const categoryColor =
    globals && globals?.categoryColorMap[outing?.activity?.category];
  const completed = outing && outingIsCompleted(outing);
  // Header subheading: what the outing is waiting on, in plain words
  const statusLabel = completed
    ? "Completed"
    : (outing?.users?.length || 0) < 2
    ? "Waiting for members"
    : !outing?.photos?.[0]
    ? "Waiting for photos"
    : outing?.completions?.find((id) => id === user?._id)
    ? "Waiting for others to finish"
    : "Ready to finish";
  // Stale-outing countdowns (rules: utils/outingLifecycle.js on the server)
  const STALE_DAYS = 30;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const daysUntil = (start) =>
    start
      ? Math.max(
          0,
          Math.ceil(
            (new Date(start).getTime() + STALE_DAYS * DAY_MS - Date.now()) /
              DAY_MS
          )
        )
      : null;
  const inviteDaysLeft =
    !completed && (outing?.invited?.length || (outing?.users?.length || 0) < 2)
      ? daysUntil(outing?.date_created)
      : null;
  // (outings from before completion_started existed count from creation,
  // same as the server)
  const finishDaysLeft =
    !completed &&
    (outing?.completions?.length || 0) > 0 &&
    (outing?.completions?.length || 0) < (outing?.users?.length || 0)
      ? daysUntil(outing.completion_started || outing.date_created)
      : null;
  const daysText = (n) =>
    n === 0 ? "less than a day" : `${n} day${n === 1 ? "" : "s"}`;
  const hasCompleted = (u) =>
    outing?.completions?.some((c) => (c?._id || c) === (u?._id || u));

  const statusTone = completed || statusLabel === "Ready to finish"
    ? styles.statusReady
    : styles.statusWaiting;
  const isLastCompletion = user && outing && userIsLastCompletion(user, outing);
  const userHasCompleted = outing?.completions?.find((id) => user._id === id);
  const chatsState = useSelector((state) => state.chat.chats);
  const outingChat = chatsState.find((c) => c._id === outing?.chat);
  const joining = !!outing?.invited?.find((i) => i._id === user?._id);
  const isOnlyUser = outing?.users?.length < 2;
  const userFlaked = outing?.flakes?.find((id) => id === user._id);
  const [editButtonText, setEditButtonText] = useState("Edit");
  const [uploads, setUploads] = useState([]);
  const userPhotoCount = outing?.photos?.filter(
    (p) => p.uploader === user?._id
  )?.length;
  const activityIsCompletedType = user.outings?.find(
    (o) => o?.activity?._id === outing?.activity?._id
  );
  const photos = outing?.photos
    ?.map((p) => userData?.photos?.find((photo) => photo.key === p.key)?.photo)
    .filter((foundPhoto) => foundPhoto);

  const [showDeleteable, setShowDeleteable] = useState(false);
  const deleteableIndexes = outing?.photos
    ?.map((p) => (p.uploader === user._id ? outing?.photos.indexOf(p) : -1))
    .filter((i) => i >= 0);
  const [deleteKey, setDeleteKey] = useState(false);
  const uploadInputRef = useRef(null);
  const [deletePhotoButtonText, setDeletePhotoButtonText] = useState("Delete");
  const [activityRating, setActivityRating] = useState(5);
  const [ratingTouched, setRatingTouched] = useState(false);

  // Handle the chat modal being shown
  const onShowChatModal = () => {
    // Swap to the chat in place (closing the outing first flashed the page
    // underneath, e.g. Profile). Back returns to this outing.
    const showChat = () => {
      swapModal(() => {
        dispatch(modalActions.setActiveChat(outingChat));
        dispatch(modalActions.setSelector("chat-modal"));
        dispatch(
          modalActions.showModal({
            headerStyle: { backgroundColor: "transparent" },
          })
        );
      });
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
      fetchPhotos(user);
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
        members. If it is, you <b>will negatively affect</b> your flake rating.
        This action is permanent (you cannot re-join after leaving).
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

  const onUploadClick = () => {
    if (userPhotoCount > 1) {
      dispatch(popupActions.showPopup("maximum-2-photos"));
      resetUploads();
    } else {
      uploadInputRef.current?.click();
    }
  };

  const onPhotosSelected = async () => {
    resetViewportShift(); // back from the iOS photo picker
    const newPhotos = document.getElementById("upload-outing-photos").files;

    // Check if user has met upload quota
    if (newPhotos.length + userPhotoCount > 2) {
      dispatch(popupActions.showPopup("maximum-2-photos"));
      resetUploads();
      return;
    }

    // Show cropper popup
    dispatch(popupActions.showPopup("outing-upload-popup"));

    // Shrink each photo in the browser (the old byte-by-byte base64 copy of
    // a full-res phone photo froze the screen), then queue it for cropping
    for (let photo of newPhotos) {
      try {
        const base64Image = await fileToResizedDataURL(photo, 1600);
        setUploads((prevState) => prevState.concat(base64Image));
      } catch {
        // not a readable image: skip it
      }
    }
  };

  const resetUploads = () => {
    setUploads([]);
    document.getElementById("upload-outing-photos-form").reset();
  };

  const onPhotoUpload = (index, photoString, resetCropper) => {
    resetViewportShift();
    const onComplete = (response) => {
      // Remove photo form uploads state
      onPhotoUploadDismiss(index);
      fetchAuth();
      fetchPhotos(response.user);

      // Reset the cropper
      resetCropper(index);
    };

    // Upload photo and add photo to photos for display
    uploadOutingPhoto(user, outing, photoString, onComplete);
    setShowDeleteable(false);
    setEditButtonText("Edit");
  };

  const onPhotoUploadDismiss = (index) => {
    resetViewportShift();
    setUploads((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);

      // Hide popup if no photos left to upload
      if (newState.length === 0) {
        dispatch(popupActions.hidePopup());
        resetUploads();
      }

      return newState;
    });
  };

  const tooManyPhotosMessage = (
    <div>
      Each Outing member can only upload up to 2 photos. You can remove some of
      your photos if you want to change or edit your uploads for this Outing.
    </div>
  );

  const onEditPhotosClick = () => {
    setShowDeleteable((prevState) => (prevState ? false : true));
    setEditButtonText((preveState) =>
      preveState === "Edit" ? "Done Editing" : "Edit"
    );
  };

  const onDeletePhoto = (index) => {
    setDeleteKey(outing.photos[index].key);
    dispatch(popupActions.showPopup("confirm-delete-photo"));
  };

  const onDeleteConfirm = () => {
    const onComplete = (response) => {
      fetchAuth();
      fetchPhotos(response.user);
      dispatch(popupActions.hidePopup());
      setDeletePhotoButtonText("Delete");
    };

    // Upload photo and add photo to photos for display
    deleteOutingPhoto(user, outing, deleteKey, onComplete);
    setDeletePhotoButtonText("Deleting..");
  };

  const noPhotosMessage = (
    <div>
      Outings need to have at least one photo uploaded before they can be marked
      completed. You can add photos in the Outing page using the button shown
      below:
      <img
        className={styles.addPhotosButton}
        src={addPhotosButton}
        alt="add-photos-button"
      />
      <br />
      <b>All Outing members must mark the Outing completed!</b>
    </div>
  );

  const needUsersMessage = (
    <div className={styles.completionMessage}>
      Outing must have 2+ members to be marked completed.
    </div>
  );

  const pendingInvites = outing?.invited?.length || 0;
  const howToCompleteMessage = (
    <div className={styles.howToComplete}>
      <p>An Outing needs at least 2 members before it can be completed.</p>
      <ol>
        <li>
          {pendingInvites
            ? `Wait for your ${
                pendingInvites === 1 ? "invite" : `${pendingInvites} invites`
              } to be accepted, or invite someone else.`
            : "Invite a friend or a Daily Match to join."}
        </li>
        <li>Go on the Outing together.</li>
        <li>Upload at least one photo from it.</li>
        <li>Every member taps Mark Completed.</li>
      </ol>
    </div>
  );

  const completionCountMessage = (
    <div className={styles.completionMessage}>
      {outing?.completions?.length} / {outing?.users?.length} Members have
      marked this Outing completed.
    </div>
  );

  const confirmCompletionMessage = (
    <div>
      {isLastCompletion && (
        <>
          <b>You are the last member to mark the Outing completed!</b>
          <br />
          <br />
        </>
      )}
      Once {isLastCompletion ? " you " : " all members "} mark the Outing
      complete, the Outing status will update to 'Completed' and no more changes
      can be made, including uploading or removing photos.
      <br />
      <br />
      The chat for this Outing will stay active indefinitely so you can keep in
      touch with Outing memebers!
      <br />
      <br />
      <div className={styles.rateActivityHeader}>
        Rate the activity to mark Outing Complete.{" "}
      </div>
      <div
        className={styles.rateActivityName}
        style={{ backgroundColor: categoryColor }}
      >
        Activity: <b>{outing?.activity?.name}</b>
      </div>
      <StarRate
        setTouched={setRatingTouched}
        rating={activityRating}
        setRating={setActivityRating}
      />
      <b>Marking the Outing compelete is permanent.</b>
    </div>
  );

  const onMarkCompletedClick = () => {
    // Not enough members yet: explain how completing works instead of
    // leaving the button dead
    if (!outing?.users?.[1]) {
      dispatch(popupActions.showPopup("outing-needs-members"));
      return;
    }
    // Block completion if no photos uploaded
    if (!outing?.photos[0]) {
      dispatch(popupActions.showPopup("no-photos"));
    } else {
      dispatch(popupActions.showPopup("confirm-completion"));
    }
  };

  const handleMarkCompleted = () => {
    const onComplete = () => {
      fetchAuth();
      dispatch(popupActions.hidePopup());
    };

    addOutingCompletion(user, outing, activityRating, onComplete);
  };

  return !outing || !userData ? null : (
    <ModalPortal>
      {outing.date_completed ? (
        // Hidden unless the outing panel is the open one (it used to render
        // under other panels, e.g. below a chat after Chat → Outing → Back)
        <div style={modalStyle} className={styles.feedCardContainer}>
          <ModalHeaderPortal selector={"outing-modal"}>
            <div
              style={{ borderLeft: `10px solid ${categoryColor}` }}
              className={styles.headerInnerContainerFeedCard}
            >
              <div className={styles.outingName}>{outing.name}</div>
              <div className={`${styles.outingStatus} ${statusTone}`}>
                {statusLabel}
              </div>
            </div>
          </ModalHeaderPortal>
          <br />
          <br />
          <br />
          <br />
          <br />
          <FeedCard outing={outing} />
        </div>
      ) : (
        <Fragment>
          <WarningPopup
            selector={"confirm-delete-outing"}
            header={"Confirm Delete Outing:"}
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
            header={"Confirm Leave Outing:"}
            message={confirmLeaveOutingMessage}
            delete={"Leave"}
            deleteClick={onOutingLeave}
            cancel={"Cancel"}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"outing-needs-members"}
            header={"How to complete an Outing"}
            message={howToCompleteMessage}
            ok={"Got it"}
            okClick={() => dispatch(popupActions.hidePopup())}
          />
          <WarningPopup
            selector={"maximum-2-photos"}
            header={"Too many photos!"}
            message={tooManyPhotosMessage}
            ok={"OK"}
            okClick={() => {
              dispatch(popupActions.hidePopup());
              resetUploads();
            }}
          />
          <WarningPopup
            selector={"confirm-delete-photo"}
            header={"Delete Photo?"}
            message={null}
            delete={deletePhotoButtonText}
            deleteClick={onDeleteConfirm}
            cancel={"Cancel"}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"no-photos"}
            header={"No Photos Uploaded!"}
            message={noPhotosMessage}
            ok={"OK"}
            okClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"confirm-completion"}
            header={"Confirm Outing Completion"}
            message={confirmCompletionMessage}
            ok={"Mark Completed"}
            okClick={handleMarkCompleted}
            okUnclickable={!ratingTouched}
            cancel={"Cancel"}
            cancelClick={() => {
              setRatingTouched(false);
              dispatch(popupActions.hidePopup());
            }}
          />
          <CropperPopup
            images={uploads}
            selector={"outing-upload-popup"}
            onCancel={onPhotoUploadDismiss}
            onUpload={onPhotoUpload}
          />
          <div style={modalStyle} className={styles.container}>
            <ModalHeaderPortal selector={"outing-modal"}>
              <div className={styles.header}>
                <div
                  style={{ borderLeft: `10px solid ${categoryColor}` }}
                  className={styles.headerInnerContainer}
                >
                  <OutingTitleEditor
                    outing={outing}
                    canEdit={outing.users?.some(
                      (u) => (u._id || u) === user._id
                    )}
                  />
                  <div className={`${styles.outingStatus} ${statusTone}`}>
                    {statusLabel}
                  </div>
                </div>
              </div>
            </ModalHeaderPortal>

            <div className={styles.sideBySide}>
              {completed || userFlaked ? null : (
                <SimpleButton
                  onClick={
                    joining
                      ? showConfirmOutingJoin
                      : !userHasCompleted
                      ? onMarkCompletedClick
                      : null
                  }
                  className={`${styles.completedButton} ${
                    userHasCompleted ? styles.unclickableButton : ""
                  }`}
                >
                  {joining
                    ? "Join Outing"
                    : userHasCompleted
                    ? `Marked Completed!`
                    : "Mark Completed"}
                </SimpleButton>
              )}
            </div>
            {!userFlaked && !joining
              ? outing.users[1]
                ? completionCountMessage
                : needUsersMessage
              : null}
            {userFlaked && (
              <Fragment>
                <div className={styles.flakeContainer}>
                  <img
                    className={styles.flakeIcon}
                    src={flakeIcon}
                    alt={"flake"}
                  />
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
              key={outing.activity?._id}
              activity={outing.activity}
              completed={activityIsCompletedType}
              hideSelect={true}
            />
            {joining || userFlaked ? null : (
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
                  <div
                    style={{ marginBottom: "2rem" }}
                    className={styles.uploadPhotosContainer}
                  >
                    <form id="upload-outing-photos-form">
                      <input
                        ref={uploadInputRef}
                        onChange={onPhotosSelected}
                        type="file"
                        multiple
                        id="upload-outing-photos"
                        style={{ display: "none" }}
                      />
                    </form>

                    <div className={styles.sideBySide}>
                      {userPhotoCount < 2 ? (
                        <SimpleButton onClick={onUploadClick} className={styles.ctaButton}>
                          + Upload
                        </SimpleButton>
                      ) : null}

                      {userPhotoCount === 1 ? (
                        <div className={styles.buttonSpacer}></div>
                      ) : null}
                      {userPhotoCount > 0 ? (
                        <SimpleButton onClick={onEditPhotosClick}>
                          {editButtonText}
                        </SimpleButton>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className={styles.photoGridContainer}>
                  <SixPhotoGrid
                    deleteableIndexes={deleteableIndexes}
                    showDeleteable={showDeleteable}
                    onDeleteClick={onDeletePhoto}
                    photos={photos}
                  />
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
              {joining || userFlaked ? null : (
                <button
                  type="button"
                  onClick={onShowChatModal}
                  className={styles.chatCircle}
                  aria-label="Open outing chat"
                  title="Chat"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z" />
                  </svg>
                </button>
              )}
            </h2>
            {finishDaysLeft !== null ? (
              <div className={styles.countdownNote}>
                {daysText(finishDaysLeft)} left for everyone to mark it
                completed. Anyone who hasn't by then is removed and gets a
                flake.
              </div>
            ) : inviteDaysLeft !== null && (outing.users?.length || 0) < 2 ? (
              <div className={styles.countdownNote}>
                If no one joins within {daysText(inviteDaysLeft)}, this Outing
                is deleted for inactivity.
              </div>
            ) : null}
            {outing.users.map((u) => (
              <FriendCard
                user={u}
                key={u._id || u}
                buttons={
                  finishDaysLeft !== null ? (
                    hasCompleted(u) ? (
                      <span className={`${styles.countdownTag} ${styles.countdownDone}`}>
                        ✓ Done
                      </span>
                    ) : (
                      <span className={styles.countdownTag}>
                        {finishDaysLeft === 0 ? "<1" : finishDaysLeft}d left
                      </span>
                    )
                  ) : null
                }
              />
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
                {inviteDaysLeft !== null ? (
                  <div className={styles.countdownNote}>
                    Invites expire in {daysText(inviteDaysLeft)} if they
                    haven't been accepted.
                  </div>
                ) : null}
                {outing.invited.map((u) => (
                  <FriendCard
                    user={u}
                    key={u._id || u}
                    buttons={
                      inviteDaysLeft !== null ? (
                        <span className={styles.countdownTag}>
                          {inviteDaysLeft === 0 ? "<1" : inviteDaysLeft}d to join
                        </span>
                      ) : null
                    }
                  />
                ))}
              </Fragment>
            ) : null}

            {!completed &&
            !joining &&
            !outing.flakes.find((id) => id === user._id) ? (
              <Fragment>
                <SimpleButton
                  onClick={
                    isOnlyUser
                      ? showConfirmOutingDelete
                      : showConfirmOutingLeave
                  }
                  className={styles.leaveButton}
                >
                  {isOnlyUser ? "Delete Outing" : "Leave Outing"}
                </SimpleButton>
                {isOnlyUser ? (
                  <div className={styles.deleteHelp}>
                    You can delete the outing becauase you are the only member.
                    Deleting the outing <b>will not negatively affect</b> your
                    flake rating.
                  </div>
                ) : (
                  <div className={styles.deleteHelp}>
                    You cannot delete the outing becauase there are other
                    members. Leaving the outing <b>will negatively affect</b>{" "}
                    your flake rating.
                  </div>
                )}
              </Fragment>
            ) : null}
          </div>
        </Fragment>
      )}
    </ModalPortal>
  );
};

export default OutingModal;
