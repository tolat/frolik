import styles from "./styles/Go.module.scss";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect, useReducer, useState } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/add-group.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import ActivityCard from "../UI/ActivityCard";
import FilterActivitiesModal from "../Modals/FilterActivitiesModal";
import balloonIcon from "../../images/air-balloon-light.png";
import downIcon from "../../images/down.png";
import upIcon from "../../images/up.png";
import { pageRouteLoader } from "../../utils/utils";
import store from "../../store";
import { goActions } from "../../store/go-slice";
import SimpleSearch from "../UI/SimpleSearch";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { popupActions } from "../../store/popup-slice";
import completeIcon from "../../images/complete.png";
import newIcon from "../../images/new.png";
import featuredIcon from "../../images/feature.png";
import {
  filterReducer,
  initialActivityFilter,
  filtersAreEqual,
} from "../../utils/utils";
import {
  createOuting,
  fetchActivities,
  fetchChat,
} from "../../utils/data-fetch";
import SliderNavber from "../UI/SliderNavbar";

const Go = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goUsers = useSelector((state) => state.go.outing.users);
  const dispatch = useDispatch();
  const outings = useSelector((state) => state.auth.user.outings);
  const completedActivities = outings?.map((outing) => outing.activity._id);
  const goState = useSelector((state) => state.go);
  const activeOuting = useSelector((state) => state.modal.activeOuting);
  const [activitySearch, setActivitySearch] = useState("");
  const globals = useSelector((state) => state.auth.globals);
  const categoryColorMap = globals && globals?.categoryColorMap;
  const [selected, setSelected] = useState(Object.keys(categoryColorMap)[0]);
  const selectedSliderKey = `_${selected}_tab`;

  const getHighlightStyle = (key) => {
    let keyCategory = Object.keys(categoryColorMap).find((k) =>
      key.includes(k)
    );

    return {
      backgroundColor: keyCategory === selected ? null : null,
    };
  };

  const handleSetSelectedCategory = (key) => {
    setSelected(Object.keys(categoryColorMap).find((k) => key.includes(k)));
  };

  const CategoryTab = (props) => {
    return <div className={styles.categoryTabContainer}>{props.name}</div>;
  };

  const sliderTabs = Object.keys(categoryColorMap).map((cat) => {
    return {
      key: `_${cat}_tab`,
      component: (
        <CategoryTab
          className={styles.categoryTab}
          name={cat}
          color={categoryColorMap[cat]}
        />
      ),
    };
  });

  const showCreateOutingPopup = useSelector(
    (state) => state.popup.showCreateOutingPopup
  );
  const [activityFilter, dispatchFilter] = useReducer(
    filterReducer,
    initialActivityFilter
  );

  // Show newly created outing popup if required by state
  useEffect(() => {
    if (showCreateOutingPopup) {
      dispatch(popupActions.showPopup("outing-created"));
    }
  }, [showCreateOutingPopup, dispatch]);

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

  // Make sure user in users list is updated to the auth user
  useEffect(() => {
    const goUser = goState.outing.users.find((u) => u._id === user._id);
    if (goUser.outings.length !== user.outings.length) {
      let newUsers = [];
      for (let u of goState.outing.users) {
        if (u._id !== user._id) {
          newUsers.push(u);
        }
        newUsers.unshift(user);
      }
      dispatch(goActions.setUsers(newUsers));
    }
  }, [goState, user, dispatch]);

  function applyActivitySearch(activities) {
    return activitySearch || activitySearch !== ""
      ? activities.filter((a) => {
          return (
            a?.name
              .toLowerCase()
              .trim()
              .includes(activitySearch.toLowerCase().trim()) ||
            a?.category
              .toLowerCase()
              .trim()
              .includes(activitySearch.toLowerCase().trim()) ||
            a?.description
              .toLowerCase()
              .trim()
              .includes(activitySearch.toLowerCase().trim()) ||
            a?.location
              .toLowerCase()
              .trim()
              .includes(activitySearch.toLowerCase().trim()) ||
            a?.goal
              .toLowerCase()
              .trim()
              .includes(activitySearch.toLowerCase().trim())
          );
        })
      : activities;
  }

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
      dispatch(popupActions.showPopup("too-many-outings"));
      return;
    }
    const onOutingCreate = (outing) => {
      dispatch(modalActions.setActiveOuting(outing));
      dispatch(popupActions.setShowCreateOutingPopup(true));
      dispatch(modalActions.setSelector("outing-modal"));
      dispatch(modalActions.showModal());
      fetchChat(user._id, outing.chat, () => {});
    };

    createOuting(goState.outing, user, onOutingCreate);
  };

  const newOutingMessage = (
    <div className={styles.outingPopup}>
      <div className={styles.outingCreatedName}>{activeOuting?.name}</div>
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

  return (
    <Fragment>
      <AddUserModal />
      <EditUsersModal />
      <FilterActivitiesModal
        filter={activityFilter.filter}
        dispatchFilter={dispatchFilter}
        initialActivityFilter={initialActivityFilter}
      />
      <WarningPopup
        selector={"outing-created"}
        header={"Your new outing is called:"}
        message={newOutingMessage}
        ok={"OK"}
        okClick={onPopupOk}
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
                defaultVal={""}
                setValue={setActivitySearch}
                className={styles.activitySearch}
                placeholder={"Search Activities.."}
              />
            </div>
            <div className={styles.infoBar}>
              <div className={styles.infoItem}>
                <img
                  src={completeIcon}
                  className={styles.infoIcon}
                  alt="completed-icon"
                />
                Completed
              </div>
              <div className={styles.infoItem}>
                <img
                  src={featuredIcon}
                  className={styles.infoIcon}
                  alt="featured-icon"
                />
                Featured
              </div>
              <div className={styles.infoItem}>
                <img src={newIcon} className={styles.infoIcon} alt="new-icon" />
                New
              </div>
            </div>
            <SliderNavber
              getHighlightStyle={getHighlightStyle}
              selected={selectedSliderKey}
              setSelected={handleSetSelectedCategory}
              tabs={sliderTabs}
            />

            {!activityFilter.activities[0] ? (
              <div className={styles.loading}>
                {activityFilter.active
                  ? "No Activities Matched Filters!"
                  : "Loading Activities.."}
              </div>
            ) : (
              applyActivitySearch(activityFilter.activities)
                .filter((a) => a.category === selected)
                .map((a) => (
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
