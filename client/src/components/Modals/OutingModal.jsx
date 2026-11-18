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
  outingStatus,
  userIsLastCompletion,
} from "../../utils/utils";
import { fetchAuth } from "../../store/auth-actions";
import CropperPopup from "../Popups/CropperPopup";
import addPhotosButton from "../../images/add-photos-button.png";
import StarRate from "../UI/StarRate";
import FeedCard from "../UI/FeedCard";
import AddOutingFriendsDrawer from "../Popups/AddOutingFriendsDrawer";
import SixPhotoGrid from "../UI/SixPhotoGrid";
import ModalHeaderPortal from "./ModalHeaderPortal";
import { useT, T } from "../../i18n";

const OutingModal = (props) => {
  const { t } = useT();
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
  const status = outingStatus(outing, user);
  const statusLabel = status.label;
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
    n === 0
      ? t("outing.countdown.lessThanADay")
      : t("outing.countdown.days", { count: n });
  const hasCompleted = (u) =>
    outing?.completions?.some((c) => (c?._id || c) === (u?._id || u));

  const statusTone = status.ready ? styles.statusReady : styles.statusWaiting;
  const isLastCompletion = user && outing && userIsLastCompletion(user, outing);
  const userHasCompleted = outing?.completions?.find((id) => user._id === id);
  const chatsState = useSelector((state) => state.chat.chats);
  const outingChat = chatsState.find((c) => c._id === outing?.chat);
  const joining = !!outing?.invited?.find((i) => i._id === user?._id);
  const isOnlyUser = outing?.users?.length < 2;
  const userFlaked = outing?.flakes?.find((id) => id === user._id);
  const [editingPhotos, setEditingPhotos] = useState(false);
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
  const [deletingPhoto, setDeletingPhoto] = useState(false);
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
        <T k="outing.deleteDrawer.message" />
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
        <T k="outing.leaveDrawer.message" />
      </div>
    </div>
  );

  const showConfirmOutingJoin = () => {
    dispatch(popupActions.showPopup("confirm-join-outing"));
  };

  // One drawer for joining (it used to open together with a second
  // "Don't be a flake!" drawer from the Alerts page)
  const confirmJoinOutingMessage = (
    <div className={styles.sheetBody}>
      <div className={styles.sheetOutingName}>{outing?.name}</div>
      <ul className={styles.sheetPoints}>
        <li>{t("outing.joinDrawer.pendingLimit")}</li>
        <li>{t("outing.joinDrawer.mustComplete")}</li>
        <li>
          <T k="outing.joinDrawer.leavingLowersRating" />
        </li>
      </ul>
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
    setEditingPhotos(false);
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
    <div>{t("outing.tooManyPhotos.message")}</div>
  );

  const onEditPhotosClick = () => {
    setShowDeleteable((prevState) => (prevState ? false : true));
    setEditingPhotos((prevState) => !prevState);
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
      setDeletingPhoto(false);
    };

    // Upload photo and add photo to photos for display
    deleteOutingPhoto(user, outing, deleteKey, onComplete);
    setDeletingPhoto(true);
  };

  const noPhotosMessage = (
    <div>
      {t("outing.noPhotos.message")}
      <img
        className={styles.addPhotosButton}
        src={addPhotosButton}
        alt={t("outing.noPhotos.buttonAlt")}
      />
      <br />
      <b>{t("outing.noPhotos.allMembers")}</b>
    </div>
  );

  const needUsersMessage = (
    <div className={styles.completionMessage}>
      {t("outing.completion.needMembers")}
    </div>
  );

  const pendingInvites = outing?.invited?.length || 0;
  const howToCompleteMessage = (
    <div className={styles.howToComplete}>
      <p>{t("outing.howToComplete.intro")}</p>
      <ol>
        <li>
          {pendingInvites
            ? t("outing.howToComplete.waitForInvites", {
                count: pendingInvites,
              })
            : t("outing.howToComplete.inviteSomeone")}
        </li>
        <li>{t("outing.howToComplete.goTogether")}</li>
        <li>{t("outing.howToComplete.uploadPhoto")}</li>
        <li>{t("outing.howToComplete.everyoneMarks")}</li>
      </ol>
    </div>
  );

  const completionCountMessage = (
    <div className={styles.completionMessage}>
      {t("outing.completion.count", {
        completed: outing?.completions?.length,
        total: outing?.users?.length,
      })}
    </div>
  );

  const ratingLabels = [
    "",
    t("outing.rating.labels.1"),
    t("outing.rating.labels.2"),
    t("outing.rating.labels.3"),
    t("outing.rating.labels.4"),
    t("outing.rating.labels.5"),
  ];
  const confirmCompletionMessage = (
    <div className={styles.sheetBody}>
      {isLastCompletion && (
        <div className={styles.lastCompletionBadge}>
          {t("outing.completeDrawer.lastMember")}
        </div>
      )}
      <div className={styles.rateCard}>
        <div className={styles.rateEyebrow}>{t("outing.rating.title")}</div>
        <div className={styles.rateActivityName}>
          <span
            className={styles.rateDot}
            style={{ backgroundColor: categoryColor }}
          />
          {outing?.activity?.name}
        </div>
        <StarRate
          setTouched={setRatingTouched}
          rating={ratingTouched ? activityRating : 0}
          setRating={setActivityRating}
        />
        <div
          className={`${styles.rateLabel} ${
            ratingTouched ? "" : styles.rateLabelHint
          }`}
        >
          {ratingTouched
            ? ratingLabels[activityRating]
            : t("outing.rating.hint")}
        </div>
      </div>
      <ul className={styles.sheetPoints}>
        <li>
          {isLastCompletion
            ? t("outing.completeDrawer.lockedYou")
            : t("outing.completeDrawer.lockedEveryone")}
        </li>
        <li>{t("outing.completeDrawer.chatStaysOpen")}</li>
        <li>{t("outing.completeDrawer.cantUndo")}</li>
      </ul>
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
      <AddOutingFriendsDrawer
        outing={outing}
        visible={modalDisplay === "flex"}
      />
      {outing.date_completed ? (
        // Hidden unless the outing panel is the open one (it used to render
        // under other panels, e.g. below a chat after Chat → Outing → Back)
        <div style={modalStyle} className={styles.feedCardContainer}>
          <ModalHeaderPortal selector={"outing-modal"}>
            <div
              style={{ borderInlineStart: `10px solid ${categoryColor}` }}
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
            header={t("outing.deleteDrawer.header")}
            message={confirmDeleteOutingMessage}
            delete={t("outing.buttons.delete")}
            deleteClick={onOutingDelete}
            cancel={t("outing.buttons.cancel")}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"confirm-join-outing"}
            header={t("outing.joinDrawer.header")}
            message={confirmJoinOutingMessage}
            ok={t("outing.buttons.joinOuting")}
            okClick={onOutingJoin}
            cancel={t("outing.buttons.cancel")}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"confirm-leave-outing"}
            header={t("outing.leaveDrawer.header")}
            message={confirmLeaveOutingMessage}
            delete={t("outing.buttons.leave")}
            deleteClick={onOutingLeave}
            cancel={t("outing.buttons.cancel")}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"outing-needs-members"}
            header={t("outing.howToComplete.header")}
            message={howToCompleteMessage}
            ok={t("outing.buttons.gotIt")}
            okClick={() => dispatch(popupActions.hidePopup())}
          />
          <WarningPopup
            selector={"maximum-2-photos"}
            header={t("outing.tooManyPhotos.header")}
            message={tooManyPhotosMessage}
            ok={t("outing.buttons.ok")}
            okClick={() => {
              dispatch(popupActions.hidePopup());
              resetUploads();
            }}
          />
          <WarningPopup
            selector={"confirm-delete-photo"}
            header={t("outing.deletePhoto.header")}
            message={null}
            delete={
              deletingPhoto
                ? t("outing.buttons.deleting")
                : t("outing.buttons.delete")
            }
            deleteClick={onDeleteConfirm}
            cancel={t("outing.buttons.cancel")}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"no-photos"}
            header={t("outing.noPhotos.header")}
            message={noPhotosMessage}
            ok={t("outing.buttons.ok")}
            okClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
          <WarningPopup
            selector={"confirm-completion"}
            header={t("outing.completeDrawer.header")}
            message={confirmCompletionMessage}
            ok={t("outing.buttons.markCompleted")}
            okClick={handleMarkCompleted}
            okUnclickable={!ratingTouched}
            cancel={t("outing.buttons.cancel")}
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
                  style={{ borderInlineStart: `10px solid ${categoryColor}` }}
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
                    ? t("outing.buttons.joinOuting")
                    : userHasCompleted
                    ? t("outing.buttons.markedCompleted")
                    : t("outing.buttons.markCompleted")}
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
                    alt={t("outing.alt.flake")}
                  />
                  <h1 className={styles.flakeText}>
                    {t("outing.flakedOut")}
                  </h1>
                </div>
              </Fragment>
            )}
            <h2 className={styles.sectionHeader}>
              {" "}
              <img
                className={styles.sectionHeaderIcon}
                src={activityIcon}
                alt={t("outing.alt.activity")}
              />{" "}
              {t("outing.sections.activity")}
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
                    alt={t("outing.alt.photos")}
                  />{" "}
                  <div className={styles.photosHeader}>
                    {t("outing.sections.photos")}
                    {!completed ? (
                      <div className={styles.photosHeaderText}>
                        {t("outing.photos.limitHint")}
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
                          {t("outing.photos.upload")}
                        </SimpleButton>
                      ) : null}

                      {userPhotoCount === 1 ? (
                        <div className={styles.buttonSpacer}></div>
                      ) : null}
                      {userPhotoCount > 0 ? (
                        <SimpleButton onClick={onEditPhotosClick}>
                          {editingPhotos
                            ? t("outing.photos.doneEditing")
                            : t("outing.photos.edit")}
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
                alt={t("outing.alt.members")}
              />{" "}
              {t("outing.sections.members")}
              {joining || userFlaked ? null : (
                <button
                  type="button"
                  onClick={onShowChatModal}
                  className={styles.chatCircle}
                  aria-label={t("outing.chat.openLabel")}
                  title={t("outing.chat.title")}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z" />
                  </svg>
                </button>
              )}
            </h2>
            {finishDaysLeft !== null ? (
              <div className={styles.countdownNote}>
                {t("outing.countdown.finishNote", {
                  time: daysText(finishDaysLeft),
                })}
              </div>
            ) : inviteDaysLeft !== null && (outing.users?.length || 0) < 2 ? (
              <div className={styles.countdownNote}>
                {t("outing.countdown.inviteNote", {
                  time: daysText(inviteDaysLeft),
                })}
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
                        {t("outing.countdown.done")}
                      </span>
                    ) : (
                      <span className={styles.countdownTag}>
                        {t("outing.countdown.daysLeftTag", {
                          days: finishDaysLeft === 0 ? "<1" : finishDaysLeft,
                        })}
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
                    alt={t("outing.alt.invited")}
                  />{" "}
                  {t("outing.sections.invited")}
                </h2>
                {inviteDaysLeft !== null ? (
                  <div className={styles.countdownNote}>
                    {t("outing.countdown.invitesExpire", {
                      time: daysText(inviteDaysLeft),
                    })}
                  </div>
                ) : null}
                {outing.invited.map((u) => (
                  <FriendCard
                    user={u}
                    key={u._id || u}
                    buttons={
                      inviteDaysLeft !== null ? (
                        <span className={styles.countdownTag}>
                          {t("outing.countdown.daysToJoinTag", {
                            days: inviteDaysLeft === 0 ? "<1" : inviteDaysLeft,
                          })}
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
                  {isOnlyUser
                    ? t("outing.buttons.deleteOuting")
                    : t("outing.buttons.leaveOuting")}
                </SimpleButton>
                {isOnlyUser ? (
                  <div className={styles.deleteHelp}>
                    <T k="outing.deleteHelp.onlyMember" />
                  </div>
                ) : (
                  <div className={styles.deleteHelp}>
                    <T k="outing.deleteHelp.otherMembers" />
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
