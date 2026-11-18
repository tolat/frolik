import { popupActions } from "../../store/popup-slice";
import BrandLoader from "../UI/BrandLoader";
import styles from "./styles/ProfileViewerModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import PhotoGrid from "../UI/PhotoGrid";
import photos from "../../images/photogrid.png";
import getOutIcon from "../../images/air-balloon.png";
import deleteFriend from "../../images/remove-friend.png";
import addFriend from "../../images/add-friend.png";
import sentMail from "../../images/sent-mail.png";
import ProfileHeader from "../UI/ProfileHeader";
import ModalPortal from "./ModalPortal";
import {
  createChat,
  fetchChats,
  fetchPhotos,
  removeFriend,
  sendFriendRequest,
} from "../../utils/data-fetch";
import chatIcon from "../../images/chat.png";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";
import { authActions } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { goActions } from "../../store/go-slice";
import ModalHeaderPortal from "./ModalHeaderPortal";
import SliderNavbar from "../UI/SliderNavbar";
import CircleAction from "../UI/CircleAction";
import WarningPopup from "../Popups/WarningPopup";
import { friendAccess } from "../../utils/friendAccess";

const sliderIcons = [
  {
    key: "_photos",
    name: "Photos",
    url: photos,
  },
];

const getPhotosFromState = (userData) => {
  return !userData
    ? []
    : userData.photos.filter((p) => p && p.photo).map((p) => p.photo);
};

const ProfileViewerModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "profile-viewer-modal" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const modalUser = useSelector((state) => state.modal.activeModalUser);
  const user = useSelector((state) => state.auth.user);
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[modalUser._id];
  const userPhotos = getPhotosFromState(userData);

  // Get photos for this user
  useEffect(() => {
    if (modalUser) {
      fetchPhotos(modalUser);
    }
  }, [modalUser]);

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <ModalHeaderPortal selector={"profile-viewer-modal"}>
          Viewing Profile
        </ModalHeaderPortal>
        <ProfileHeader
          user={modalUser}
          headerButtons={<ControlButtons user={user} modalUser={modalUser} />}
        />
        <SliderNavbar
          id="slider-navbar"
          selected={"_photos"}
          setSelected={() => {}}
          icons={sliderIcons}
          style={{ paddingTop: "0" }}
        />
        <Fragment>
          {user._id === modalUser._id ? (
            <Fragment>
              <br />
              <br />
            </Fragment>
          ) : null}
          {userPhotos[0] ? (
            <PhotoGrid
              images={userPhotos}
              gridTemplateColumns={
                userPhotos.length === 1
                  ? `1fr`
                  : userPhotos.length === 2
                  ? "1fr 1fr"
                  : "1fr 1fr 1fr"
              }
            />
          ) : user.outings.length > 0 ? (
            <h2>No Photos Yet!</h2>
          ) : (
            <BrandLoader />
          )}
        </Fragment>
      </div>
    </ModalPortal>
  );
};

const ControlButtons = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const access = friendAccess(props.user, props.modalUser);
  const isFriend = access.isFriend;
  const friendRequested = props.user.friend_requests.find(
    (fr) => fr === props.modalUser._id
  );
  const former = access.former;
  const hasCompletedOutingTogether = access.canAddFriend;

  const onLockedAddFriend = () => {
    const name = props.modalUser.first_name;
    dispatch(
      popupActions.setWarningHeader(
        former ? "Not yet" : "Complete an Outing first"
      )
    );
    dispatch(
      popupActions.setWarningMessage(
        former
          ? `You and ${name} were friends before. To be friends again, ${name} needs to come up in your daily matches and you need to complete a new Outing together.`
          : `You can add ${name} as a friend once one of you has matched with the other in Daily Matches and you've completed an Outing together.`
      )
    );
    dispatch(popupActions.showPopup("generic-warning"));
  };

  const onAddFriend = () => {
    const onComplete = (response) => {
      dispatch(
        authActions.setUser({
          ...response.user,
          friends: props.user.friends,
        })
      );
    };
    sendFriendRequest(props.user, props.modalUser, onComplete);
  };

  const onRemoveFriend = () => {
    const onComplete = (response) => {
      dispatch(
        authActions.setUser({
          ...response.user,
          friends: response.populatedFriends,
        })
      );
    };
    removeFriend(props.user, props.modalUser, onComplete);
  };

  const onCreateOuting = () => {
    dispatch(goActions.addUser(props.modalUser));
    navigate("/outing");
  };

  // Same as + Chat on the friend cards: open (or create) a chat with them
  const onCreateChat = () => {
    createChat(props.user, [props.modalUser], async (response) => {
      fetchChats(props.user);
      dispatch(modalActions.setActiveChat(response.chat));
      await hideModal(true);
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
    });
  };

  const name = props.modalUser.first_name;
  const hidePopup = () => dispatch(popupActions.hidePopup());

  return (
    <div className={styles.friendCardButtons}>
      <WarningPopup
        selector="confirm-unfriend"
        header={`Unfriend ${name}?`}
        message={
          <>
            {name} will be removed from your friends, and neither of you will
            be able to open the other's profile.
            <br />
            <br />
            <b>You can't just add {name} back.</b> To be friends again,{" "}
            {name} has to come up in your Daily Matches and you have to
            complete a new Outing together.
          </>
        }
        cancel="Cancel"
        cancelClick={hidePopup}
        delete="Unfriend"
        deleteClick={() => {
          hidePopup();
          onRemoveFriend();
        }}
      />
      <WarningPopup
        selector="confirm-friend-request"
        header={`Send ${name} a friend request?`}
        message={`${name} will get an alert and can accept or deny it.`}
        ok="Send Request"
        okClick={() => {
          hidePopup();
          onAddFriend();
        }}
        cancel="Cancel"
        cancelClick={hidePopup}
      />
      {isFriend ? (
        <>
          <CircleAction
            compact
            onClick={onCreateChat}
            icon={chatIcon}
            label="+ Chat"
          />
          <CircleAction
            compact
            onClick={onCreateOuting}
            icon={getOutIcon}
            label="+ Outing"
          />
          <CircleAction
            compact
            onClick={() => dispatch(popupActions.showPopup("confirm-unfriend"))}
            icon={deleteFriend}
            label="Unfriend"
            tone="secondary"
          />
        </>
      ) : friendRequested ? (
        <CircleAction
          compact
          icon={sentMail}
          label="Requested"
          tone="secondary"
        />
      ) : hasCompletedOutingTogether ? (
        <CircleAction
          compact
          onClick={() =>
            dispatch(popupActions.showPopup("confirm-friend-request"))
          }
          icon={addFriend}
          label="+ Friend"
        />
      ) : (
        <CircleAction
          compact
          onClick={onLockedAddFriend}
          icon={addFriend}
          label="+ Friend"
          tone="locked"
        />
      )}
    </div>
  );
};

export default ProfileViewerModal;
