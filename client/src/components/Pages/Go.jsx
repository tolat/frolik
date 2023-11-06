import styles from "./styles/Go.module.scss";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect, useReducer, useState } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/plus.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import { createOuting, fetchActivities } from "../../utils/data-fetch";
import ActivityCard from "../UI/ActivityCard";
import FilterActivitiesModal from "../Modals/FilterActivitiesModal";
import balloonIcon from "../../images/air-balloon-light.png";
import downIcon from "../../images/down.png";
import upIcon from "../../images/up.png";
import { calcAvgRating, pageRouteLoader } from "../../utils/utils";
import store from "../../store";
import { goActions } from "../../store/go-slice";
import SimpleSearch from "../UI/SimpleSearch";
import WarningPopup from "../Popups/WarningPopup";
import { useNavigate } from "react-router-dom";
import outingsBarIcon from "../../images/outingsToolbar.png";
import OutingModal from "../Modals/OutingModal";
import { popupActions } from "../../store/popup-slice";
import completeIcon from "../../images/complete.png";
import featuredIcon from "../../images/feature.png";

const initialActivityFilter = {
  filter: {
    category: "Any",
    maxParticipants: "",
    minParticipants: "",
    minRating: "",
    maxCost: "",
    minCost: "",
    maxTime: "",
    newOnly: false,
    completedOnly: false,
    featuredOnly: false,
  },
  activities: [],
  initialActivities: [],
  active: false,
};

const filterReducer = (state, action) => {
  const applyFilter = (activities, filter) => {
    const filteredActivities = [];
    const completedActivities = store
      .getState()
      .auth.user?.outings?.map((outing) => outing.activity._id);

    // Apply category filter
    for (let activity of activities) {
      if (
        // Category
        (filter?.category &&
          filter?.category !== "Any" &&
          activity?.category !== filter?.category) ||
        // Participant
        (filter?.minParticipants &&
          activity.participants < filter?.minParticipants) ||
        (filter?.maxParticipants &&
          activity.participants > filter?.maxParticipants) ||
        // Rating
        (filter?.minRating && calcAvgRating(activity) < filter?.minRating) ||
        // Cost
        (filter?.minCost && activity.cost < filter?.minCost) ||
        (filter?.maxCost && activity.cost > filter?.maxCost) ||
        // Time
        (filter?.maxTime && activity.duration > filter?.maxTime) ||
        // Fetured Only
        (filter?.featuredOnly && !activity.featured) ||
        // New Only
        (filter?.newOnly && completedActivities.includes(activity._id)) ||
        // Completed Only
        (filter?.completedOnly && !completedActivities.includes(activity._id))
      ) {
        continue;
      } else {
        filteredActivities.push(activity);
      }
    }

    return filteredActivities;
  };

  if (action.type === "set-initial") {
    return { ...state, initialActivities: action.activities };
  }

  if (action.type === "apply-filter") {
    const activities = applyFilter(state.initialActivities, action.filter);
    return {
      ...state,
      activities: activities,
      filter: action.filter,
      active: action.active,
    };
  }
};

const filtersAreEqual = (f1, f2) => {
  for (let key in f1) {
    if (f1?.[key] !== f2?.[key]) {
      return false;
    }
  }

  return true;
};

const Go = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goUsers = useSelector((state) => state.go.outing.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const outings = useSelector((state) => state.auth.user.outings);
  const completedActivities = outings?.map((outing) => outing.activity._id);
  const goState = useSelector((state) => state.go);
  const excuse5th = useSelector((state) => state.go.excuse5th);
  const [activityFilter, dispatchFilter] = useReducer(
    filterReducer,
    initialActivityFilter
  );
  const [modalOuting, setModalOuting] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Show popup for redirect back to profile if user has 5 pending outings
  useEffect(() => {
    if (user.outings.filter((o) => o.status === "Pending").length > 4)
      dispatch(popupActions.showPopup("too-many-outings"));
  }, [user, dispatch, excuse5th]);

  // Navigate
  const handleHideWarning = () => {
    dispatch(popupActions.hidePopup());
    navigate("/profile");
  };

  // Get all activities
  useEffect(() => {
    async function fetchActivityData() {
      const setInitial = (activities) => {
        dispatchFilter({ type: "set-initial", activities });
      };
      await fetchActivities(setInitial);
      dispatchFilter({
        type: "apply-filter",
        filter: initialActivityFilter.filter,
      });
    }

    fetchActivityData();
  }, []);

  // Handle Add user button click
  const handleAddUserClick = () => {
    dispatch(modalActions.setSelector("add-user"));
    dispatch(modalActions.showModal());
  };

  // Handle Edit users button click
  const handleEditUsersClick = () => {
    dispatch(modalActions.setSelector("edit-users"));
    dispatch(modalActions.showModal());
  };

  // Handle filter activities button click
  const handleFilterActivitiesClick = () => {
    dispatch(modalActions.setSelector("filter-activities"));
    dispatch(modalActions.showModal());
  };

  // Create Pending outing for all added users
  const handleCreateOuting = () => {
    if (user.outings.filter((o) => o.status === "Pending").length > 4) {
      console.log("CREATING OUTING");
      dispatch(popupActions.showPopup("too-many-outings"));
      return;
    }
    const onOutingCreate = (outing) => {
      setModalOuting(outing);
      setShowInfoPopup(true);
      dispatch(modalActions.setSelector("outing"));
      dispatch(modalActions.showModal());
    };
    dispatch(goActions.setExcuse5th(true));
    createOuting(goState.outing, user, onOutingCreate);
  };

  const tooManyOutingsMessage = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <b>You can only have up to 5 pending outings at a time.</b> <br />
      Either complete or delete some outings before trying to create another
      one. You can view your outings any time in the 'Profile' page by clicking
      the following tab:
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={"outings-icon"}
      />
    </div>
  );

  return (
    <Fragment>
      <AddUserModal />
      <EditUsersModal />
      <OutingModal showInfoPopup={showInfoPopup} outing={modalOuting} />
      <FilterActivitiesModal
        filter={activityFilter.filter}
        dispatchFilter={dispatchFilter}
        initialActivityFilter={initialActivityFilter}
      />
      <WarningPopup
        selector={"too-many-outings"}
        header={"You have too many Pending Outings!"}
        message={tooManyOutingsMessage}
        ok={"Return to Profile page"}
        okClick={handleHideWarning}
      />
      <div className={styles.container}>
        <div className={styles.usersContainer}>
          <button
            onClick={goState.outing.users[1] ? handleEditUsersClick : null}
            className={styles.roundButton}
          >
            <img
              className={
                goState.outing.users[1] ? styles.editIcon : styles.iconBlocked
              }
              src={editIcon}
              alt="edit-friends"
            />
          </button>
          <UserIconCluster
            backerClassName={styles.iconBacker}
            users={goUsers}
            sizeInRem={20}
            borderSizeInRem={1.5}
            pieShadow={true}
          />
          <button onClick={handleAddUserClick} className={styles.roundButton}>
            <img className={styles.editIcon} src={plusIcon} alt="add-people" />
          </button>
        </div>
        {!goState.outing.activity.name ? (
          <Fragment>
            <div className={styles.selectHeader}>Select Activity</div>
            <img
              className={styles.downIcon}
              src={downIcon}
              alt="down-arrow"
            />{" "}
          </Fragment>
        ) : !goState.outing.users[1] ? (
          <Fragment>
            <img className={styles.upIcon} src={upIcon} alt="up-arrow" />{" "}
            <div className={styles.addPeopleHeader}>Add People</div>
          </Fragment>
        ) : (
          <SimpleButton
            onClick={handleCreateOuting}
            className={styles.goButton}
          >
            <img
              className={styles.balloonIcon}
              src={balloonIcon}
              alt="balloon-icon"
            />{" "}
            Create Outing
          </SimpleButton>
        )}
        {goState.outing.activity.name ? (
          <ActivityCard
            key={Math.random()}
            activity={goState.outing.activity}
            completed={completedActivities.find(
              (id) => id === goState.outing.activity._id
            )}
          />
        ) : null}
        {!goState.outing.activity.name ? (
          <Fragment>
            <div className={styles.sideBySide}>
              <SimpleButton
                onClick={handleFilterActivitiesClick}
                className={`${styles.filterButton}
                ${
                  filtersAreEqual(
                    initialActivityFilter.filter,
                    activityFilter.filter
                  )
                    ? null
                    : styles.activeFiltersButton
                }
             `}
              >
                {filtersAreEqual(
                  initialActivityFilter.filter,
                  activityFilter.filter
                )
                  ? "Filter Activities"
                  : "Change Filters"}
              </SimpleButton>
              <div className={styles.buttonSpacer}></div>
              <SimpleSearch
                className={styles.activitySearch}
                placeholder={"Search Activities"}
              />
            </div>
            <div className={styles.infoBar}>
              <div className={styles.infoItem}>
                <img
                  src={completeIcon}
                  className={styles.infoIcon}
                  alt="completed-icon"
                />
                Previously Done
              </div>
              <div className={styles.infoItem}>
                <img
                  src={featuredIcon}
                  className={styles.infoIcon}
                  alt="featured-icon"
                />
                Featured
              </div>
            </div>

            {!activityFilter.activities[0] ? (
              <div className={styles.loading}>
                {activityFilter.active
                  ? "No Activities Matched Filters!"
                  : "Loading Activities.."}
              </div>
            ) : (
              activityFilter.activities.map((a) => (
                <ActivityCard
                  key={Math.random()}
                  activity={a}
                  completed={completedActivities.find((id) => id === a._id)}
                />
              ))
            )}
          </Fragment>
        ) : null}
      </div>
    </Fragment>
  );
};

export default Go;

export const goLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  // Make sure to goState outing has at least the main user in the userlist
  if (!store.getState().go.outing.users[0])
    store.dispatch(goActions.setUsers([store.getState().auth.user]));

  return null;
};
