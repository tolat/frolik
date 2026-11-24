import styles from "./styles/Profile.module.scss";
import BrandLoader from "../UI/BrandLoader";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
import SliderNavbar from "../UI/SliderNavbar";
import PhotoGrid from "../UI/PhotoGrid";
import photos from "../../images/photogrid.png";
import friends from "../../images/friends.png";
import outings from "../../images/outing2.png";
import OutingList from "../UI/OutingList";
import { modalActions } from "../../store/modal-slice";
import EditProfileModal from "../Modals/EditProfileModal";
import FriendCard from "../UI/FriendCard";
import {
  calculateFlakeRating,
  outingStats,
  pageRouteLoader,
  toSorted,
} from "../../utils/utils";
import balloonIcon from "../../images/air-balloon.png";
import { useNavigate } from "react-router-dom";
import CircleAction from "../UI/CircleAction";
import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/air-balloon.png";
import SimpleSearch from "../UI/SimpleSearch";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import outingsBarIcon from "../../images/outingsToolbar.png";
import ProfileHeader from "../UI/ProfileHeader";
import { goActions } from "../../store/go-slice";
import { createChat, fetchChats } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import editIcon from "../../images/edit-light.png";
import { useT, T } from "../../i18n";

// Labels are translated at render time (t is passed in)
const getSliderIcons = (t) => [
  {
    key: "_photos",
    name: t("profile.tabs.photos"),
    url: photos,
  },
  {
    key: "_outings",
    name: t("profile.tabs.outings"),
    url: outings,
  },
  {
    key: "_friends",
    name: t("profile.tabs.friends"),
    url: friends,
  },
];

const getPhotosFromState = (userData) => {
  return !userData
    ? []
    : userData.photos.filter((p) => p && p.photo).map((p) => p.photo);
};

const Profile = (props) => {
  const { t } = useT();
  const user = { ...useSelector((state) => state.auth.user) };
  const [selectedSliderKey, setSelectedSliderKey] = useState("_outings");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataState = useSelector((state) => state.data);
  const userData = dataState.users[user._id];
  const userPhotos = getPhotosFromState(userData);
  const modalIsShowing = useSelector(
    (state) => state.modal.selector !== "none"
  );

  const onBalloonIconClick = () => {
    navigate("/outing");
  };

  const handleEditButtonClick = (e) => {
    dispatch(modalActions.setSelector("edit-profile"));
    dispatch(modalActions.showModal());
  };

  const onCreateOuting = (withUser) => {
    dispatch(goActions.reset([user]));
    dispatch(goActions.addUser(withUser));
    navigate("/outing");
  };

  const onCreateChat = (withUser) => {
    const onComplete = async (response) => {
      fetchChats(user);
      dispatch(modalActions.setActiveChat(response.chat));
      if (modalIsShowing) await hideModal(true);
      dispatch(modalActions.setSelector("chat-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "transparent" },
        })
      );
    };

    createChat(user, [withUser], onComplete);
  };

  const FriendCardButtons = (props) => {
    return (
      <div className={styles.friendCardButtons}>
        <CircleAction
          onClick={() => onCreateChat(props.user)}
          icon={chatIcon}
          label={t("profile.friendCard.chat")}
        />
        <CircleAction
          onClick={() => onCreateOuting(props.user)}
          icon={getOutIcon}
          label={t("profile.friendCard.outing")}
        />
      </div>
    );
  };

  const tooManyOutingsMessage = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <T k="nav.tooManyOutings.message" />
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={t("nav.tooManyOutings.iconAlt")}
      />
    </div>
  );

  // The balloon icon inside the empty-state sentences (links to the Outing page)
  const balloonLink = (
    <img
      onClick={onBalloonIconClick}
      className={styles.outingBalloon}
      style={{ verticalAlign: "middle" }}
      src={balloonIcon}
      alt={t("profile.empty.balloonAlt")}
    />
  );

  const handleHideWarning = () => {
    dispatch(popupActions.hidePopup());
  };

  const [friendSearch, setFriendSearch] = useState("");
  // Friends list sort: { key: "name" | "outings" | "flake", dir: "asc" |
  // "desc" } or null (off → A–Z by name). Tapping a pill cycles it
  // off → ascending → descending → off. Values match the friend cards.
  const [friendSort, setFriendSort] = useState(null);
  const cycleSort = (key) =>
    setFriendSort((prev) =>
      prev?.key !== key
        ? { key, dir: "asc" }
        : prev.dir === "asc"
        ? { key, dir: "desc" }
        : null
    );
  const completedCount = (f) => outingStats(f).total; // completed + flaked
  const byName = (a, b) =>
    `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
  const sortValue = {
    name: null,
    outings: completedCount,
    flake: (f) => Number(calculateFlakeRating(f)),
  };
  const friendComparator = (a, b) => {
    if (!friendSort) return byName(a, b);
    const sign = friendSort.dir === "desc" ? -1 : 1;
    const get = sortValue[friendSort.key];
    const primary = get ? get(a) - get(b) : byName(a, b);
    return sign * primary || byName(a, b);
  };

  function applyFriendSearch(friends) {
    return friendSearch || friendSearch !== ""
      ? user &&
          user.friends?.filter((f) => {
            return (
              f.first_name
                ?.toLowerCase()
                .trim()
                .includes(friendSearch.toLowerCase().trim()) ||
              f.last_name
                ?.toLowerCase()
                .trim()
                .includes(friendSearch.toLowerCase().trim())
            );
          })
      : user.friends;
  }

  return (
    <div className={styles.container}>
      <EditProfileModal />
      <WarningPopup
        selector={"too-many-outings"}
        header={t("nav.tooManyOutings.header")}
        message={tooManyOutingsMessage}
        ok={t("nav.tooManyOutings.ok")}
        okClick={handleHideWarning}
      />
      <div className={styles.nonMediaSection} id="non-media-section">
        <ProfileHeader
          badge={
            <img
              onClick={handleEditButtonClick}
              src={editIcon}
              className={styles.editIcon}
              alt={t("profile.edit")}
            />
          }
          onEditClick={handleEditButtonClick}
          user={user}
        />
        <SliderNavbar
          id="slider-navbar"
          selected={selectedSliderKey}
          setSelected={setSelectedSliderKey}
          icons={getSliderIcons(t)}
        />
      </div>
      {!userPhotos[0] && !user.friends[0] && !user.outings[0] ? (
        <div className={styles.noContentBlurb}>
          <h3>{t("profile.empty.title")}</h3>
          <div style={{ textAlign: "center" }}>
            <T
              k="profile.empty.noMedia"
              components={{ balloon: balloonLink }}
            />
          </div>
        </div>
      ) : selectedSliderKey === "_photos" ? (
        <Fragment>
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
          ) : user.outings.length > 0 ? null : (
            <BrandLoader />
          )}

          {!userPhotos[0] ? (
            <div className={styles.noImagesBlurb}>
              <div style={{ textAlign: "center" }}>
                <T
                  k="profile.empty.noPhotos"
                  components={{ balloon: balloonLink }}
                />
              </div>
            </div>
          ) : null}
        </Fragment>
      ) : selectedSliderKey === "_outings" ? (
        <Fragment>
          <OutingList />
        </Fragment>
      ) : (
        <Fragment>
          <SimpleSearch
            style={{ marginTop: "1rem" }}
            placeholder={t("profile.friends.searchPlaceholder")}
            setValue={setFriendSearch}
          />
          {user.friends[0] ? (
            <div className={styles.sortRow} role="group" aria-label={t("profile.friends.sortLabel")}>
              <span className={styles.sortLabel}>
                {t("profile.friends.sort")}
              </span>
              {[
                ["name", t("profile.friends.sortName")],
                ["outings", t("profile.friends.sortOutings")],
                ["flake", t("profile.friends.sortFlake")],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={friendSort?.key === key}
                  aria-label={
                    friendSort?.key === key
                      ? friendSort.dir === "asc"
                        ? t("profile.friends.sortByAsc", { label })
                        : t("profile.friends.sortByDesc", { label })
                      : t("profile.friends.sortBy", { label })
                  }
                  className={`${styles.sortPill} ${
                    friendSort?.key === key ? styles.sortPillActive : ""
                  }`}
                  onClick={() => cycleSort(key)}
                >
                  {label}
                  {friendSort?.key === key ? (
                    <span className={styles.sortArrow} aria-hidden="true">
                      {friendSort.dir === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
          {user.friends[0] ? (
            toSorted(applyFriendSearch(user.friends), friendComparator).map((f) => (
              <FriendCard
                buttons={<FriendCardButtons user={f} />}
                key={f._id}
                user={f}
              />
            ))
          ) : (
            <div className={styles.noImagesBlurb}>
              <div style={{ textAlign: "center" }}>
                <T
                  k="profile.empty.noFriends"
                  components={{ balloon: balloonLink }}
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Profile;

export const profileLoader = async () => {
  const redirect = await pageRouteLoader("/profile");
  if (redirect) {
    return redirect;
  }

  return null;
};
