import styles from "./styles/Go.module.scss";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/add-group.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import ActivityCard from "../UI/ActivityCard";
import FilterActivitiesModal from "../Modals/FilterActivitiesModal";
import balloonIcon from "../../images/air-balloon-light.png";
import { capitalizeFirstLetter, pageRouteLoader } from "../../utils/utils";
import store from "../../store";
import { goActions } from "../../store/go-slice";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { popupActions } from "../../store/popup-slice";
import completeIcon from "../../images/complete.png";
import completeIconLight from "../../images/complete-light.png";
import creationIcon from "../../images/sketch.png";
import creationIconLight from "../../images/sketch-light.png";
import featuredIcon from "../../images/feature.png";
import featuredIconLight from "../../images/feature-light.png";
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
import CreateActivityModal from "../Modals/CreateActivityModal";
import LoaderSpinner from "../UI/LoaderSpinner";

const Go = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goUsers = useSelector((state) => state.go.outing.users);
  const dispatch = useDispatch();
  const outings = useSelector((state) => state.auth.user.outings);
  const completedActivities = outings?.map((outing) => outing.activity._id);
  const goState = useSelector((state) => state.go);
  const activeOuting = useSelector((state) => state.modal.activeOuting);
  const globals = useSelector((state) => state.auth.globals);
  const categoryColorMap = globals && globals?.categoryColorMap;
  const [selected, setSelected] = useState(
    categoryColorMap ? Object.keys(categoryColorMap)[0] : undefined
  );
  useEffect(() => {
    if (!selected && categoryColorMap)
      setSelected(Object.keys(categoryColorMap)[0]);
  }, [selected, categoryColorMap]);
  const selectedSliderKey = `_${selected}_tab`;
  const [createButtonText, setCreateButtonText] = useState("Create Outing");
  const creatingOutingText = (
    <div style={{ display: "flex" }}>
      Creating.. &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
    </div>
  );

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
    if (!goUser || goUser.outings?.length !== user.outings.length) {
      const others = goState.outing.users.filter((u) => u._id !== user._id);
      dispatch(goActions.setUsers([user, ...others]));
    }
  }, [goState, user, dispatch]);

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

  // Every outing needs at least one Daily Match (a non-friend). Friends and
  // matches are the only people the Add Members modal offers, so any
  // non-friend member other than the user is a match. The server enforces
  // this against the user's actual match list.
  const friendIDs = new Set((user.friends || []).map((f) => f._id || f));
  const addedMatches = goState.outing.users.filter(
    (u) => u._id !== user._id && !friendIDs.has(u._id)
  );
  const hasDailyMatch = addedMatches.length > 0;
  const hasMembers = !!goState.outing.users[1];
  const hasActivity = !!goState.outing.activity?.name;

  // "Pick an activity" chip: scroll to the activity cards and bounce them
  const activitiesRef = useRef(null);
  const handlePickActivityClick = () => {
    const el = activitiesRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const cards = [...el.children].slice(0, 6);
    // Let the scroll get under way before the cards bounce
    setTimeout(() => {
      cards.forEach((card, i) =>
        card.animate?.(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-14px)", offset: 0.3 },
            { transform: "translateY(0)", offset: 0.55 },
            { transform: "translateY(-5px)", offset: 0.75 },
            { transform: "translateY(0)" },
          ],
          { duration: 650, delay: i * 70, easing: "ease-out" }
        )
      );
    }, 250);
  };

  // Create Pending outing for all added users
  const handleCreateOuting = () => {
    const pendingOutings = user.outings.filter(
      (o) =>
        o.users?.some((u) => (u._id || u) === user._id) &&
        o.users.length !== o.completions?.length
    );
    if (pendingOutings.length > 4) {
      dispatch(popupActions.showPopup("too-many-outings"));
      return;
    }
    const onComplete = (outing) => {
      setCreateButtonText("Create Outing");
      dispatch(modalActions.setActiveOuting(outing));
      dispatch(popupActions.setShowCreateOutingPopup(true));
      dispatch(modalActions.setSelector("outing-modal"));
      dispatch(
        modalActions.showModal({
          headerStyle: { backgroundColor: "white" },
        })
      );
      fetchChat(user._id, outing.chat, () => {});
    };

    setCreateButtonText(creatingOutingText);
    createOuting(goState.outing, user, onComplete, () =>
      setCreateButtonText("Create Outing")
    );
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

  const onCreateActivityClick = () => {
    dispatch(modalActions.setSelector("create-activity"));
    dispatch(modalActions.showModal());
  };

  const addActivity = (activity) => {
    dispatchFilter({ type: "add-activity", payload: activity });
    setSelected(capitalizeFirstLetter(activity?.category.toLowerCase()));
  };

  const removeActivity = (activity) => {
    dispatchFilter({ type: "remove-activity", payload: activity });
  };

  const toggleButtonFilter = (key) => {
    let newFilter = { ...activityFilter.filter };
    newFilter[key] = !activityFilter.filter[key];

    dispatchFilter({
      type: "apply-filter",
      filter: newFilter,
    });
  };

  return (
    <Fragment>
      <AddUserModal />
      <EditUsersModal />
      <CreateActivityModal addActivity={addActivity} />
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
            style={{ opacity: goState.outing.users[1] ? 1 : 0.2 }}
          >
            <img
              className={styles.editIcon}
              src={editIcon}
              alt="edit-friends"
            />
          </button>
          <UserIconCluster
            users={goUsers}
            sizeInRem={18}
            borderSizeInRem={1.4}
          />
          <button onClick={handleAddUserClick} className={styles.roundButton}>
            <img
              className={`${styles.editIcon} ${
                goState.outing.activity?.name && goState.outing.users.length < 2
                  ? styles["bump"]
                  : null
              }`}
              src={plusIcon}
              alt="add-people"
            />
          </button>
        </div>
        <div className={styles.requirements}>
          <button
            type="button"
            onClick={handlePickActivityClick}
            className={`${styles.requirement} ${
              hasActivity ? styles.requirementMet : styles.requirementAction
            }`}
          >
            <span className={styles.requirementDot}>{hasActivity ? "✓" : "1"}</span>
            {hasActivity ? "Activity picked" : "Pick an activity"}
          </button>
          <button
            type="button"
            onClick={handleAddUserClick}
            className={`${styles.requirement} ${
              hasDailyMatch ? styles.requirementMet : styles.requirementAction
            }`}
          >
            <span className={styles.requirementDot}>{hasDailyMatch ? "✓" : "2"}</span>
            {hasDailyMatch
              ? `${addedMatches.length} Daily Match${addedMatches.length > 1 ? "es" : ""} added`
              : "Add a Daily Match"}
          </button>
        </div>
        {hasMembers && hasActivity && hasDailyMatch && (
          <SimpleButton
            onClick={
              createButtonText === "Create Outing" ? handleCreateOuting : null
            }
            className={styles.goButton}
          >
            <img
              className={styles.balloonIcon}
              src={balloonIcon}
              alt="balloon-icon"
            />{" "}
            {createButtonText}
          </SimpleButton>
        )}

        {goState.outing.activity?.name ? (
          <Fragment>
            {goState.outing.users[1] && goState.outing.activity?.name ? null : (
              <Fragment>
                <br />
                <br />
              </Fragment>
            )}

            <div ref={activitiesRef} className={styles.selectedActivity}>
              <ActivityCard
                key={goState.outing.activity?._id || "selected-activity"}
                activity={goState.outing.activity}
                removeActivity={removeActivity}
                completed={completedActivities.find(
                  (id) => id === goState.outing.activity._id
                )}
              />
            </div>
          </Fragment>
        ) : (
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
                  ? "Filter"
                  : "Edit Filter"}
              </SimpleButton>
              <div className={styles.buttonSpacer}></div>
              <SimpleButton
                onClick={onCreateActivityClick}
                className={styles.createActivityButton}
              >
                + Create
              </SimpleButton>
            </div>
            <div className={styles.infoBar}>
              <div
                className={`${styles.infoItem} ${
                  activityFilter.filter.completed ? styles.activeInfoItem : null
                }`}
                onClick={() => toggleButtonFilter("completed")}
              >
                <img
                  src={
                    activityFilter.filter.completed
                      ? completeIconLight
                      : completeIcon
                  }
                  className={styles.infoIcon}
                  alt="completed-icon"
                />
                Completed
              </div>
              <div
                className={`${styles.infoItem} ${styles.infoItemCenter} ${
                  activityFilter.filter.featured ? styles.activeInfoItem : null
                }`}
                onClick={() => toggleButtonFilter("featured")}
              >
                <img
                  src={
                    activityFilter.filter.featured
                      ? featuredIconLight
                      : featuredIcon
                  }
                  className={styles.infoIcon}
                  alt="featured-icon"
                />
                Featured
              </div>
              <div
                className={`${styles.infoItem} ${
                  activityFilter.filter.created ? styles.activeInfoItem : null
                }`}
                onClick={() => toggleButtonFilter("created")}
              >
                <img
                  src={
                    activityFilter.filter.created
                      ? creationIconLight
                      : creationIcon
                  }
                  className={styles.infoIcon}
                  alt="creations-icon"
                />
                Creations
              </div>
            </div>
            <SliderNavber
              getHighlightStyle={getHighlightStyle}
              selected={selectedSliderKey}
              setSelected={handleSetSelectedCategory}
              tabs={sliderTabs}
              style={{ paddingTop: "0" }}
            />
            <div ref={activitiesRef} className={styles.activitiesContainer}>
              {!activityFilter.activities[0] ? (
                <div className={styles.loading}>
                  {activityFilter.active ||
                  activityFilter.filter.completed ||
                  activityFilter.filter.featured ||
                  activityFilter.filter.created ? (
                    <h4>No Activities Match Filters!</h4>
                  ) : (
                    <h4>Loading Activities..</h4>
                  )}
                </div>
              ) : (
                activityFilter.activities
                  .filter((a) => a?.category === selected)
                  .map((a) => (
                    <ActivityCard
                      key={a._id}
                      activity={a}
                      completed={completedActivities.find((id) => id === a._id)}
                      removeActivity={removeActivity}
                    />
                  ))
              )}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Go;

export const goLoader = async () => {
  const redirect = await pageRouteLoader("/outing");
  if (redirect) {
    return redirect;
  }

  // Make sure to goState outing has at least the main user in the userlist
  if (!store.getState().go.outing.users[0])
    store.dispatch(goActions.setUsers([store.getState().auth.user]));

  return null;
};
