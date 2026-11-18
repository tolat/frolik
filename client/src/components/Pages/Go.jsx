import styles from "./styles/Go.module.scss";
import { scrollToElement } from "../../utils/scrollTo";
import SkeletonCards from "../UI/SkeletonCards";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { OUTING_NAME_MAX } from "../../utils/limits";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import { usePageRefresh } from "../../utils/pageRefresh";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/add-group.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import ActivityCard from "../UI/ActivityCard";
import FilterActivitiesModal from "../Modals/FilterActivitiesModal";
import balloonIcon from "../../images/air-balloon-light.png";
import {
  capitalizeFirstLetter,
  outingIsCompleted,
  pageRouteLoader,
} from "../../utils/utils";
import store from "../../store";
import { goActions } from "../../store/go-slice";
import WarningPopup from "../Popups/WarningPopup";
import outingsBarIcon from "../../images/outingsToolbar.png";
import { popupActions } from "../../store/popup-slice";
import {
  filterReducer,
  initialActivityFilter,
} from "../../utils/utils";
import {
  createOuting,
  fetchActivities,
  fetchChat,
  renameOuting,
} from "../../utils/data-fetch";
import SliderNavber from "../UI/SliderNavbar";
import CreateActivityModal from "../Modals/CreateActivityModal";
import LoaderSpinner from "../UI/LoaderSpinner";
import { useT } from "../../i18n";

// The category colour, see-through: a soft highlight behind the tab title
const tint = (color, alpha) => {
  const m = String(color || "").match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})` : color;
};

// Category tabs only: the category colour darkened just enough to reach a
// contrast against the page (WCAG ratio), same hue — pastels like Sports
// yellow or Art green were nearly invisible as text/underline. Everything
// else (avatars, stripes) keeps the original colour.
const PAGE_BG = [244, 246, 250];
const luminance = ([r, g, b]) => {
  const ch = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hslToRgb = (h, s, l) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
};
const inkFor = (color, target) => {
  const m = String(color || "").match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return color;
  const rgb = m.slice(1, 4).map(Number);
  if (contrast(rgb, PAGE_BG) >= target) return `rgb(${rgb.join(", ")})`;
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  let l = (max + min) / 2;
  const sat = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  // Softened saturation: pastels are near-100% saturated in HSL, so darkening
  // them as-is turned out neon (lime green, pure red)
  const soft = Math.min(sat, 0.6);
  let out = rgb;
  while (l > 0.05 && contrast(out, PAGE_BG) < target) {
    l -= 0.01;
    out = hslToRgb(h, soft, l);
  }
  return `rgb(${out.join(", ")})`;
};

const Go = (props) => {
  const { t, tOr } = useT();
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
  const [creatingOuting, setCreatingOuting] = useState(false);
  const creatingOutingText = (
    <div style={{ display: "flex" }}>
      {t("go.create.creating")} &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
    </div>
  );

  // The selected category tab takes that category's colour: underline and
  // title in just-deep-enough versions of it (inkFor), the pastel behind
  const getHighlightStyle = (key) => {
    let keyCategory = Object.keys(categoryColorMap).find((k) =>
      key.includes(k)
    );

    return keyCategory === selected
      ? { backgroundColor: inkFor(categoryColorMap[keyCategory], 2) }
      : {};
  };

  const handleSetSelectedCategory = (key) => {
    setSelected(Object.keys(categoryColorMap).find((k) => key.includes(k)));
  };

  const CategoryTab = (props) => {
    return (
      <div
        className={styles.categoryTabContainer}
        style={
          props.selected
            ? {
                color: inkFor(props.color, 4.5),
                backgroundColor: tint(props.color, 0.35),
                // a lighter take on the buttons' lift, in the tab's colour
                boxShadow: `0 1px 5px ${tint(props.color, 0.45)}`,
              }
            : null
        }
      >
        {props.name}
      </div>
    );
  };

  const sliderTabs = Object.keys(categoryColorMap).map((cat) => {
    return {
      key: `_${cat}_tab`,
      component: (
        <CategoryTab
          className={styles.categoryTab}
          name={tOr("data.categories." + cat, cat)}
          color={categoryColorMap[cat]}
          selected={cat === selected}
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

  // Pull-to-refresh: reload the activity list, keeping the current filter
  const activityFilterRef = useRef(activityFilter);
  activityFilterRef.current = activityFilter;
  usePageRefresh(async () => {
    await fetchActivities((activities) =>
      dispatchFilter({ type: "set-initial", activities })
    );
    dispatchFilter({
      type: "apply-filter",
      filter: activityFilterRef.current.filter,
    });
  });

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
  // How many filters differ from the defaults (shown on the Filter button)
  const activeFilterCount = Object.keys(initialActivityFilter.filter).filter(
    (k) =>
      k !== "category" &&
      (activityFilter.filter?.[k] ?? "") !== initialActivityFilter.filter[k]
  ).length;

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
  // At most one friend per Daily Match (also enforced by the server)
  const addedFriends = goState.outing.users.filter(
    (u) => u._id !== user._id && friendIDs.has(u._id)
  );
  const matchesNeeded = Math.max(0, addedFriends.length - addedMatches.length);
  const matchesMet = hasDailyMatch && matchesNeeded === 0;
  const hasMembers = !!goState.outing.users[1];
  const hasActivity = !!goState.outing.activity?.name;

  // "Pick an activity" chip: scroll to the activity cards and bounce them
  const activitiesRef = useRef(null);
  const handlePickActivityClick = () => {
    const el = activitiesRef.current;
    if (!el) return;
    scrollToElement(el, { block: "start", offset: 12 });
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
        !outingIsCompleted(o)
    );
    if (pendingOutings.length > 4) {
      dispatch(popupActions.showPopup("too-many-outings"));
      return;
    }
    const onComplete = (outing) => {
      setCreatingOuting(false);
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

    setCreatingOuting(true);
    createOuting(goState.outing, user, onComplete, () =>
      setCreatingOuting(false)
    );
  };

  // The new-outing popup lets you rename the outing straight away
  const [newOutingName, setNewOutingName] = useState("");
  const [savingName, setSavingName] = useState(false);
  useEffect(() => {
    setNewOutingName(activeOuting?.name || "");
  }, [activeOuting?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const newOutingMessage = (
    <div className={styles.outingPopup}>
      <div className={styles.outingNameField}>
        <input
          className={styles.outingNameInput}
          value={newOutingName}
          maxLength={OUTING_NAME_MAX}
          onChange={(e) => setNewOutingName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onPopupOk()}
          aria-label={t("go.created.nameLabel")}
        />
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.outingNamePencil}>
          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4z" />
          <path d="M13.5 6.5l4 4" />
        </svg>
      </div>
      <div className={styles.outingNameHint}>
        {t("go.created.nameHint", {
          length: newOutingName.length,
          max: OUTING_NAME_MAX,
        })}
      </div>
      {t("go.created.inviteSent")}
      <img
        className={styles.outingsIcon}
        src={outingsBarIcon}
        alt={t("go.created.outingsIconAlt")}
      />
      <div>
        {t("go.created.chatCreated")}
      </div>
    </div>
  );

  const onPopupOk = () => {
    const name = newOutingName.trim();
    if (!activeOuting?._id || !name || name === activeOuting.name) {
      setNewOutingName(activeOuting?.name || "");
      dispatch(popupActions.hidePopup());
      return;
    }
    if (savingName) return;
    setSavingName(true);
    renameOuting(user, activeOuting._id, name, (updated) => {
      setSavingName(false);
      if (updated) dispatch(modalActions.setActiveOuting(updated));
      dispatch(popupActions.hidePopup());
    });
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
        header={t("go.created.header")}
        message={newOutingMessage}
        ok={savingName ? t("go.created.saving") : t("go.created.ok")}
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
              alt=""
            />
            <span className={styles.roundButtonLabel}>
              {t("go.members.edit")}
            </span>
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
              alt=""
            />
            <span className={styles.roundButtonLabel}>
              {t("go.members.add")}
            </span>
          </button>
        </div>
        {/* Checklist until the outing is ready, then just the Create button.
            One wrapper keeps the tour's spotlight target either way. */}
        <div className={styles.readyArea} data-tour="outing-requirements">
          {hasMembers && hasActivity && matchesMet ? (
            <SimpleButton
              onClick={
                creatingOuting ? null : handleCreateOuting
              }
              className={styles.goCta}
            >
              <span className={styles.goCtaIcon}>
                <img src={balloonIcon} alt="" />
              </span>
              <span className={styles.goCtaText}>
                <span className={styles.goCtaTitle}>
                  {creatingOuting ? creatingOutingText : t("go.create.button")}
                </span>
                <span className={styles.goCtaSub}>
                  {t("go.create.summary", {
                    count: goState.outing.users.length - 1,
                    activity: goState.outing.activity?.name,
                  })}
                </span>
              </span>
              <svg viewBox="0 0 24 24" className={styles.goCtaArrow} aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SimpleButton>
          ) : (
            <>
              <div className={styles.requirements}>
              <button
                type="button"
                onClick={handlePickActivityClick}
                className={`${styles.requirement} ${
                  hasActivity ? styles.requirementMet : styles.requirementAction
                }`}
              >
                <span className={styles.requirementDot}>{hasActivity ? "✓" : "1"}</span>
                {hasActivity
                  ? t("go.requirements.activityPicked")
                  : t("go.requirements.pickActivity")}
              </button>
              <button
                type="button"
                onClick={handleAddUserClick}
                className={`${styles.requirement} ${
                  matchesMet ? styles.requirementMet : styles.requirementAction
                }`}
              >
                <span className={styles.requirementDot}>{matchesMet ? "✓" : "2"}</span>
                {!hasDailyMatch
                  ? t("go.requirements.addMatch")
                  : matchesNeeded > 0
                  ? t("go.requirements.addMoreMatches", { count: matchesNeeded })
                  : t("go.requirements.matchesAdded", {
                      count: addedMatches.length,
                    })}
              </button>
              </div>
              {matchesNeeded > 0 && (
                <div className={styles.requirementNote}>
                  {t("go.requirements.matchNote")}
                </div>
              )}
            </>
          )}
        </div>

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
            <SimpleButton
              onClick={handleFilterActivitiesClick}
              className={`${styles.filterButton} ${
                activeFilterCount ? styles.activeFiltersButton : ""
              }`}
              data-tour="activity-tools"
            >
              <svg
                className={styles.filterIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              {t("go.filter")}
              {activeFilterCount ? (
                <span className={styles.filterCount}>{activeFilterCount}</span>
              ) : null}
            </SimpleButton>
            <div className={styles.categoryRow}>
              <SliderNavber
                className={styles.categorySlider}
                getHighlightStyle={getHighlightStyle}
                selected={selectedSliderKey}
                setSelected={handleSetSelectedCategory}
                tabs={sliderTabs}
                style={{ paddingTop: "0" }}
              />
              <button
                type="button"
                onClick={onCreateActivityClick}
                className={styles.createActivityPlus}
                aria-label={t("go.createActivityLabel")}
                title={t("go.createActivityTitle")}
                data-tour="create-activity"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            <div
              ref={activitiesRef}
              className={styles.activitiesContainer}
              data-tour="activities"
            >
              {!activityFilter.activities[0] ? (
                <div className={styles.loading}>
                  {activityFilter.active ||
                  activityFilter.filter.completed ||
                  activityFilter.filter.featured ||
                  activityFilter.filter.created ? (
                    <h4>{t("go.noMatchingActivities")}</h4>
                  ) : (
                    <SkeletonCards variant="activity" count={2} />
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
