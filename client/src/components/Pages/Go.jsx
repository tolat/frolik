import styles from "./styles/Go.module.scss";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect, useReducer } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/plus.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import buttonStyles from "../../components/UI/styles/SimpleButton.module.scss";
import { fetchActivities } from "../../utils/data-fetch";
import ActivityCard from "../UI/ActivityCard";
import FilterActivitiesModal from "../Modals/FilterActivitiesModal";
import balloonIcon from "../../images/air-balloon-light.png";
import downIcon from "../../images/down.png";
import upIcon from "../../images/up.png";
import { hideModalFast } from "../../store/modal-actions";
import { calcAvgRating, pageLoader } from "../../utils/utils";
import { initialActivityFilter } from "../../utils/globals";
import store from "../../store";

const filterReducer = (state, action) => {
  const applyFilter = (activities, filter) => {
    const filteredActivities = [];
    const completedActivities = store
      .getState()
      .auth.user.outings.map((outing) => outing.activity._id);

    // Apply category filter
    for (let activity of activities) {
      if (
        // Category
        (filter.category &&
          filter.category !== "Any" &&
          activity.category !== filter.category) ||
        // Participant
        (filter.minParticipants &&
          activity.participants < filter.minParticipants) ||
        (filter.maxParticipants &&
          activity.participants > filter.maxParticipants) ||
        // Rating
        (filter.minRating && calcAvgRating(activity) < filter.minRating) ||
        // Cost
        (filter.minCost && activity.cost < filter.minCost) ||
        (filter.maxCost && activity.cost > filter.maxCost) ||
        // Time
        (filter.maxTime && activity.duration > filter.maxTime) ||
        // Fetured Only
        (filter.featuredOnly && !activity.featured) ||
        // New Only
        (filter.newOnly && completedActivities.includes(activity._id)) ||
        // Completed Only
        (filter.completedOnly && !completedActivities.includes(activity._id))
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
    if (f1[key] !== f2[key]) {
      return false;
    }
  }

  return true;
};

const Go = (props) => {
  const dispatch = useDispatch();
  const [activityFilter, dispatchFilter] = useReducer(
    filterReducer,
    initialActivityFilter
  );
  const Outings = useSelector((state) => state.auth.user.outings);
  const completedActivities = Outings.map((outing) => outing.activity._id);
  const goState = useSelector((state) => state.go);
  const users = goState.outing.users;

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

  return (
    <Fragment>
      <AddUserModal />
      <EditUsersModal />
      <FilterActivitiesModal
        filter={activityFilter.filter}
        dispatchFilter={dispatchFilter}
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
          <UserIconCluster users={users} sizeInRem={16} borderSizeInRem={1.5} />
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
          <SimpleButton className={styles.goButton}>
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
            showInstructions={true}
          />
        ) : null}
        {!goState.outing.activity.name ? (
          <Fragment>
            <SimpleButton
              onClick={handleFilterActivitiesClick}
              className={
                filtersAreEqual(
                  initialActivityFilter.filter,
                  activityFilter.filter
                )
                  ? buttonStyles.greyButton
                  : styles.activeFiltersButton
              }
            >
              {filtersAreEqual(
                initialActivityFilter.filter,
                activityFilter.filter
              )
                ? "Filter Activities"
                : "Change Filters"}
            </SimpleButton>

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
  const redirect = await pageLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};
