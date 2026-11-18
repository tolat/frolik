import { useDispatch, useSelector } from "react-redux";
import SkeletonCards from "../UI/SkeletonCards";
import styles from "./styles/AddUserModal.module.scss";
import ModalPortal from "./ModalPortal";
import FriendCard from "../UI/FriendCard";
import { goActions } from "../../store/go-slice";
import { Fragment, useEffect, useState } from "react";
import { fetchMatchedUsers } from "../../utils/data-fetch";
import { collapseOut } from "../../utils/animations";
import ModalHeaderPortal from "./ModalHeaderPortal";
import { alphabetSort, toSorted } from "../../utils/utils";
import SimpleSearch from "../UI/SimpleSearch";
import { useT } from "../../i18n";

const AddUserModal = (props) => {
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const goState = useSelector((state) => state.go);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "add-user" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [matchedUsers, setMatchedUsers] = useState([]);
  const fetchingMatchedUsers = useSelector(
    (state) => state.auth.fetchingMatchedUsers
  );
  const availableFriends = user.friends.filter(
    (f) =>
      (f.status.status === "Ready" || f.status.status === "Searching") &&
      !goState.outing.users.some((u) => u._id === f._id) &&
      f._id !== user._id
  );
  const availableMatches = matchedUsers.filter(
    (u) => !goState.outing.users.some((ou) => ou._id === u._id)
  );

  // Confirm with a check mark, then fade + collapse the card to its real
  // height (the old max-height trick left a pause, then snapped padding and
  // margin, which made the list jump).
  const addUserToOuting = (u, buttonEl) => {
    const elt = document.getElementById(
      `${u._id || u}-friendCard-addUserModal`
    );
    if (!elt || elt.dataset.collapsing) return;
    const add = () => dispatch(goActions.addUser(u));
    if (buttonEl) {
      buttonEl.textContent = "✓";
      buttonEl.classList.add(styles.addButtonDone);
    }
    collapseOut(elt, add, { delay: 160 }); // let the check mark register first
  };

  // Get matched users
  useEffect(() => {
    fetchMatchedUsers(user, setMatchedUsers);
  }, [user, setMatchedUsers]);

  // One friend per Daily Match. The first friend can be added straight away
  // (before any match); Create Outing still needs a match for every friend.
  const friendIDSet = new Set((user.friends || []).map((f) => f._id || f));
  const membersAdded = goState.outing.users.filter((u) => u._id !== user._id);
  const friendsAdded = membersAdded.filter((u) => friendIDSet.has(u._id)).length;
  const matchesAdded = membersAdded.length - friendsAdded;
  const friendSlots = Math.max(0, Math.max(1, matchesAdded) - friendsAdded);

  const AddButton = (props) => {
    const locked = props.locked;
    return (
      <div
        onClick={
          locked ? undefined : (e) => addUserToOuting(props.user, e.currentTarget)
        }
        className={`${styles.addButton} ${locked ? styles.addButtonLocked : ""}`}
        title={locked ? t("addUsers.lockedTitle") : undefined}
        aria-disabled={locked || undefined}
      >
        +
      </div>
    );
  };

  const [friendSearch, setFriendSearch] = useState("");

  function applyFriendSearch(friends) {
    return friendSearch || friendSearch !== ""
      ? friends.filter((f) => {
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
      : friends;
  }

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <ModalHeaderPortal selector={"add-user"}>
          {t("addUsers.header")}
        </ModalHeaderPortal>
        <div className={styles.dailyMatchesContainer}>
          <h2 className={styles.matchesHeader}>
            {t("addUsers.dailyMatches")}{" "}
            <span className={styles.requiredBadge}>
              {t("addUsers.required")}
            </span>
          </h2>
          <div className={styles.headerSubtext}>
            {t("addUsers.matchesSubtext")}
          </div>

          {availableMatches[0] ? (
            availableMatches.map((u) => (
              <FriendCard
                id={`${u._id || u}-friendCard-addUserModal`}
                buttonSet={"add"}
                user={u}
                key={u._id}
                buttons={<AddButton user={u} />}
              />
            ))
          ) : fetchingMatchedUsers ? (
            <SkeletonCards variant="person" count={3} />
          ) : (
            <h2>{t("addUsers.noMatches")}</h2>
          )}
        </div>
        {availableFriends[0] ? (
          <Fragment>
            <h2 style={{ width: "100%", fontSize: "1.8rem", marginBottom: "0.4rem" }}>
              {t("addUsers.activeFriends")}
            </h2>
            <div className={styles.friendSlots}>
              {friendSlots > 0
                ? matchesAdded === 0
                  ? t("addUsers.friendSlots.firstFriend")
                  : t("addUsers.friendSlots.more", { count: friendSlots })
                : t("addUsers.friendSlots.none")}
            </div>
            <SimpleSearch
              placeholder={t("addUsers.searchPlaceholder")}
              setValue={setFriendSearch}
            />
            {toSorted(applyFriendSearch(availableFriends), alphabetSort).map(
              (f) => (
                <FriendCard
                  id={`${f._id || f}-friendCard-addUserModal`}
                  buttonSet={"add"}
                  user={f}
                  key={f._id}
                  buttons={<AddButton user={f} locked={friendSlots <= 0} />}
                />
              )
            )}
          </Fragment>
        ) : (
          <h2 style={{ marginTop: "3rem" }}>{t("addUsers.noFriends")}</h2>
        )}
      </div>
    </ModalPortal>
  );
};

export default AddUserModal;
