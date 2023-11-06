import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/OutingModal.module.scss";
import SimpleButton from "../UI/SimpleButton";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { Fragment, useEffect, useState } from "react";
import { popupActions } from "../../store/popup-slice";
import PhotoGrid from "../UI/PhotoGrid";
import photosIcon from "../../images/photos.png";
import activityIcon from "../../images/activity.png";
import membersIcon from "../../images/people.png";
import inviteIcon from "../../images/invite.png";
import FriendCard from "../UI/FriendCard";
import ActivityCard from "../UI/ActivityCard";
import ChatModal from "./ChatModal";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";
import { fetchChat } from "../../utils/data-fetch";

const OutingModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === props.selector ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const showInfoPupup = props.showInfoPopup;
  const user = useSelector((state) => state.auth.user);
  const userData = useSelector((state) => state.data.users[user._id]);
  const dispatch = useDispatch();
  const outing = props.outing;
  const globals = useSelector((state) => state.auth.globals);
  const [categoryColor, setCategoryColor] = useState(null);
  const [completed, setCompleted] = useState(false);
  const chatsState = useSelector((state) => state.chat.chats);
  const outingChat = chatsState.find((c) => c._id === outing.chat);
  const joining = !!outing?.invited?.find((i) => i._id === user?._id);
  const activityIsCompletedType = user.outings?.find(
    (o) => o?.activity?._id === outing?.activity?._id
  );
  const photos = outing?.photos?.map(
    (key) => userData?.photos?.find((p) => p.key === key).photo
  );

  // Show the info popup if this is the first time opening
  useEffect(() => {
    if (showInfoPupup && modalDisplay === "flex") {
      dispatch(popupActions.showPopup("outing-created"));
    }
  }, [showInfoPupup, dispatch, modalDisplay]);

  // Set categoryColour
  useEffect(() => {
    if (outing && globals && globals.categoryColorMap) {
      setCategoryColor(globals.categoryColorMap[outing.activity.category]);
      setCompleted(outing.status === "Completed");
    }
  }, [outing, globals]);

  const newOutingMessage = (
    <div className={styles.outingPopup}>
      <div className={styles.outingCreatedName}>{outing.name}</div>
      An invite has been sent to the other users. You can view this outing any
      time on the Profile page under the following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
      <div>
        A new chat for this outing has also been created! When others accept the
        Outing they will be added to the chat.
      </div>
    </div>
  );

  const onPopupOk = () => {
    dispatch(popupActions.hidePopup());
  };

  const onShowChatModal = () => {
    const showChat = async () => {
      await hideModal();
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(modalActions.showModal());
    };
    fetchChat(user._id, outing.chat, showChat);
  };

  return !outing || !userData ? null : (
    <ModalPortal>
      <ChatModal chat={outingChat} />
      <WarningPopup
        selector={"outing-created"}
        header={"Your new outing is called:"}
        message={newOutingMessage}
        ok={"OK"}
        okClick={onPopupOk}
      />
      <div style={modalStyle} className={styles.container}>
        <div className={styles.header}>
          <div
            style={{ borderLeft: `10px solid ${categoryColor}` }}
            className={styles.headerInnerContainer}
          >
            <div className={styles.outingName}>{outing.name}</div>
            <div
              className={styles.outingStatus}
            >{`Status: ${outing.status}`}</div>
          </div>
        </div>
        <div className={styles.sideBySide}>
          {joining ? null : (
            <SimpleButton
              onClick={onShowChatModal}
              className={styles.chatButton}
            >
              Chat
            </SimpleButton>
          )}
          {!joining && !completed ? (
            <div className={styles.buttonSpacer}></div>
          ) : null}

          {completed ? null : (
            <SimpleButton className={styles.completedButton}>
              {joining ? "Join Outing" : "Mark Completed"}
            </SimpleButton>
          )}
        </div>
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
        <h2 className={styles.sectionHeader}>
          {" "}
          <img
            className={styles.sectionHeaderIcon}
            src={photosIcon}
            alt={"photos"}
          />{" "}
          Photos
        </h2>
        {outing.photos[0] ? (
          <div className={styles.photoGridContainer}>
            <PhotoGrid images={photos} gridTemplateColumns="1fr 1fr" />
          </div>
        ) : (
          <div className={styles.noPhotosMessage}>
            <div className={styles.noPhotosMessageHeader}>None Yet!</div>
            <div className={styles.noPhotosMessageText}>
              Each outing member can add one photo when the Outing is completed!
            </div>
          </div>
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

        {outing.status !== "Completed" && !joining ? (
          <Fragment>
            <SimpleButton className={styles.leaveButton}>
              {outing.users.length < 2 ? "Delete Outing" : "Leave Outing"}
            </SimpleButton>
            {outing.users.length < 2 ? (
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
