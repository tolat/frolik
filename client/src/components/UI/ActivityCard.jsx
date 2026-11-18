import StatIcon from "./StatIcon";
import { shineSync } from "../../utils/shine";
import { SkeletonCard } from "./SkeletonCards";
import styles from "./styles/ActivityCard.module.scss";
import timeIcon from "../../images/clock.png";
import costIcon from "../../images/bill.png";
import ratingIcon from "../../images/star.png";
import groupIcon from "../../images/friends.png";
import SimpleButton from "./SimpleButton";
import { Fragment, useState, useCallback, useEffect } from "react";
import balloonLightIcon from "../../images/air-balloon-light.png";
import balloonBlueIcon from "../../images/air-balloon-blue.png";
import completeIcon from "../../images/complete.png";
import featuredIcon from "../../images/feature.png";
import { scrollPageTo } from "../../utils/pageScroll";
import creationIcon from "../../images/sketch.png";
import { calcAvgRating } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { goActions } from "../../store/go-slice";
import InstructionCard from "./InstructionCard";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { hideModal } from "../../store/modal-actions";
import { deleteActivity } from "../../utils/data-fetch";
import { useLocation, useNavigate } from "react-router-dom";
import SixPhotoGrid from "./SixPhotoGrid";
import TintedIcon from "./TintedIcon";
import { useT } from "../../i18n";

const ActivityCard = (props) => {
  const { t } = useT();
  const categoryColorMap = useSelector(
    (state) => state.auth.globals.categoryColorMap
  );
  const statIconStyle = { width: "2rem", height: "2rem" };
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const dispatch = useDispatch();
  const goState = useSelector((state) => state.go);
  const user = useSelector((state) => state.auth.user);
  const [deleting, setDeleting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const noPhotoContainerStyle = {
    filter: "none",
    backgroundImage: "none",
    position: "relative",
  };
  const noPhotoUpperStyle = { paddingTop: 0 };
  const hasPhotos = props.activity?.photos && props.activity.photos[0];
  const currentUrl = location.pathname;

  // Hide the button bar until at least the first photo has loaded so it
  // doesn't flash on top of the shimmer tile before the image is ready.
  // (In the drawer the text and instructions show at once; only the photo
  // area shimmers while it loads — the whole-card grey tile made the
  // instructions look grey until the photo arrived.)
  const [photoLoaded, setPhotoLoaded] = useState(!hasPhotos || !!props.drawer);
  // Whole-card loading tile until the photo is in (8s safety net)
  useEffect(() => {
    if (photoLoaded) return;
    const timer = setTimeout(() => setPhotoLoaded(true), 8000);
    return () => clearTimeout(timer);
  }, [photoLoaded]);
  const handleFirstPhotoLoad = useCallback(() => setPhotoLoaded(true), []);

  const handleToggleInstructions = (e) => {
    setInstructionsVisible((prev) => !prev);
  };

  const handleSelect = () => {
    dispatch(goActions.setActivity(props.activity));
    // The list collapses to the chosen card: bring the user back to the top
    // (checklist + Create button) so no stale scroll offset is left behind
    scrollPageTo(0, "smooth");
  };

  const handleRemove = () => {
    dispatch(goActions.removeActivity());
  };

  const handleDeleteActivity = () => {
    dispatch(
      popupActions.showPopup(`confirm-delete-activity-${props.activity._id}`)
    );
  };

  const confirmDeleteMessage = (
    <div className={styles.warningContainer}>
      <div className={styles.warningName}>{props.activity?.name}</div>
      <div className={styles.warningText}>
        {t("activity.delete.permanent")}
      </div>
    </div>
  );

  const onActivityDelete = () => {
    const onComplete = () => {
      setDeleting(false);
      dispatch(popupActions.hidePopup());

      // Set goActivity to false
      if (
        goState.outing.activity &&
        goState.outing.activity._id === props.activity._id
      ) {
        dispatch(goActions.removeActivity());
      }

      // Remove activity from activities list
      props.removeActivity(props.activity);
    };

    setDeleting(true);
    deleteActivity(user, props.activity, onComplete);
  };

  // Send to a friend: swap this popup for the friend picker
  const handleSend = () => {
    dispatch(popupActions.setSendActivity(props.activity));
    dispatch(popupActions.showPopup("send-activity"));
  };

  const modalOpen = useSelector((state) => state.modal.marginLeft === "0%");
  const handleUseActivity = () => {
    // Opened from a chat panel: close it so the outing page shows
    if (modalOpen) hideModal();
    dispatch(goActions.reset([user]));
    dispatch(goActions.setActivity(props.activity));
    setTimeout(() => dispatch(popupActions.hidePopup()), 1500);
    navigate("/outing");
  };

  // Photo cards: the stats sit in the title row, inside the dark fade at the
  // top of the photo, where they stay legible (names are capped at 20 chars)
  const statsOnTop = hasPhotos && !props.creatingActivity;
  const statIcons = (
    <Fragment>
      <StatIcon
        alt={t("activity.stats.time")}
        icon={timeIcon}
        iconStyle={statIconStyle}
        rating={
          props.creatingActivity
            ? props.activity.duration
            : t("activity.stats.hours", { count: props.activity.duration })
        }
      />
      <div className={styles.spacer} />
      <StatIcon
        alt={t("activity.stats.cost")}
        icon={costIcon}
        iconStyle={statIconStyle}
        rating={
          props.creatingActivity
            ? props.activity.cost
            : t("activity.stats.costValue", { cost: props.activity.cost })
        }
      />
      <div className={styles.spacer} />
      <StatIcon
        alt={t("activity.stats.group")}
        icon={groupIcon}
        iconStyle={statIconStyle}
        rating={
          props.creatingActivity
            ? props.activity.participants
            : t("activity.stats.participants", { count: props.activity.participants })
        }
      />
      {!props.creatingActivity && (
        <Fragment>
          <div className={styles.spacer} />
          <StatIcon
            alt={t("activity.stats.rating")}
            icon={ratingIcon}
            iconStyle={statIconStyle}
            rating={calcAvgRating(props.activity)}
          />
        </Fragment>
      )}
    </Fragment>
  );
  // Photo cards in lists use the feed layout (not the drawer, not Create
  // Activity, not the social popups that open with instructions shown)
  // (and the activity drawer, which opens with the instructions showing)
  const feedCard =
    hasPhotos && !props.creatingActivity && (props.drawer || !props.showInstructions);
  const badges = (
    <Fragment>
      {props.completed ? (
        <div className={styles.completedIconContainer}>
          <img
            src={completeIcon}
            className={styles.completedIcon}
            alt={t("activity.badges.completed")}
          />
        </div>
      ) : null}
      {props.activity.featured ? (
        <div className={styles.completedIconContainer}>
          <img
            src={featuredIcon}
            className={styles.completedIcon}
            alt={t("activity.badges.featured")}
          />
        </div>
      ) : null}
      {props.activity.created_by ? (
        <Fragment>
          <div className={styles.completedIconContainer}>
            <img
              src={creationIcon}
              className={styles.completedIcon}
              alt={t("activity.badges.created")}
            />
          </div>
          {currentUrl === "/outing" && (
            <SimpleButton
              noShadow={true}
              onClick={handleDeleteActivity}
              className={styles.deleteActivityButton}
              style={hasPhotos && !feedCard ? { filter: "invert(1)" } : null}
            >
              {t("activity.actions.delete")}
            </SimpleButton>
          )}
        </Fragment>
      ) : null}
    </Fragment>
  );

  if (feedCard && categoryColorMap) {
    const isSelected = goState.outing.activity?.name === props.activity.name;
    const rating = calcAvgRating(props.activity);
    const chips = [
      t("activity.stats.hours", { count: props.activity.duration }),
      t("activity.stats.costValue", { cost: props.activity.cost }),
      t("activity.stats.participants", { count: props.activity.participants }),
    ];
    const selectButton = props.hideSelect ? null : isSelected ? (
      <button type="button" className={`${styles.feedSelect} ${styles.feedRemove}`} onClick={handleRemove}>
        {t("activity.actions.remove")}
      </button>
    ) : (
      <button type="button" className={styles.feedSelect} onClick={handleSelect}>
        {t("activity.actions.select")}
      </button>
    );
    const instructionsButton = (
      <button type="button" className={styles.feedGhost} onClick={handleToggleInstructions}>
        {instructionsVisible
          ? t("activity.actions.hideInstructions")
          : t("activity.actions.showInstructions")}
      </button>
    );
    const chipRow = (
      <div className={styles.feedChips}>
        {chips.map((c, i) => (
          <span key={i} className={styles.feedChip}>
            <img src={[timeIcon, costIcon, groupIcon][i]} alt="" />
            {c}
          </span>
        ))}
      </div>
    );
    return (
      <div
        style={photoLoaded ? props.style : { ...props.style, ...shineSync() }}
        className={`${styles.feedCard} ${props.drawer ? styles.drawer : ""} ${
          photoLoaded ? "tile-ready" : "tile-loading has-skeleton"
        }`}
      >
        {props.activity.created_by ? (
          <WarningPopup
            selector={`confirm-delete-activity-${props.activity._id}`}
            header={t("activity.delete.header")}
            message={confirmDeleteMessage}
            delete={deleting ? t("activity.delete.deleting") : t("activity.actions.delete")}
            deleteClick={onActivityDelete}
            cancel={t("activity.actions.cancel")}
            cancelClick={() => dispatch(popupActions.hidePopup())}
          />
        ) : null}
        <div
          className={styles.feedPhoto}
          style={
            props.activity.cover_position
              ? { "--cover-position": props.activity.cover_position }
              : null
          }
        >
          <SixPhotoGrid
            photos={props.activity.photos}
            // Drawer: the drawer starts off-screen (lazy loading held the
            // photo back), and tapping the art opens it full screen
            eager={!!props.drawer}
            onClick={props.drawer ? null : handleToggleInstructions}
            onFirstLoad={handleFirstPhotoLoad}
          />
          {chipRow}
          <span className={styles.feedRating}>
            <img src={ratingIcon} alt={t("activity.stats.rating")} />
            {rating}
          </span>
        </div>
        <div className={styles.feedBody}>
          <div className={styles.feedName}>{props.activity.name}</div>
          <div className={styles.feedMeta}>
            {props.activity.location}
            <span className={styles.inlineBadges}>{badges}</span>
          </div>
          <div className={styles.feedDescription}>{props.activity.description}</div>
          {props.drawer ? null : (
            <div className={styles.feedActions}>
              {instructionsButton}
              {selectButton}
            </div>
          )}
        </div>
        <div
          style={{
            maxHeight: instructionsVisible || props.showInstructions ? "200rem" : "0",
          }}
          className={`${styles.instructionsContainer} ${styles.feedInstructions}`}
        >
          <div className={styles.goalLine}>
            <span className={styles.goalLabel}>{t("activity.goalHeader")}</span>{" "}
            {props.activity.goal}
          </div>
          {props.activity.instructions && props.activity.instructions[0] && (
            <Fragment>
              <div className={styles.iHeader}>{t("activity.instructionsHeader")}</div>
              {props.activity.instructions.map((i, idx) => (
                <InstructionCard key={`${i.type ?? ""}${idx}`} instruction={i} />
              ))}
            </Fragment>
          )}
        </div>
        {/* Drawer: Create Outing / Send pinned to the bottom */}
        {props.drawer ? (
          <Buttons
            {...props}
            hasPhotos={false}
            handleSend={handleSend}
            currentUrl={currentUrl}
            handleUseActivity={handleUseActivity}
            handleToggleInstructions={handleToggleInstructions}
            instructionsVisible={instructionsVisible}
            goState={goState}
            handleRemove={handleRemove}
            handleSelect={handleSelect}
          />
        ) : null}
        {!photoLoaded && <SkeletonCard variant="activity" fill />}
      </div>
    );
  }

  return (
    categoryColorMap && (
      <div
        style={photoLoaded ? props.style : { ...props.style, ...shineSync() }}
        className={`${styles.outerContainer} ${
          photoLoaded ? "tile-ready" : "tile-loading has-skeleton"
        } ${props.fitHeight ? styles.fitHeight : ""} ${
          props.drawer ? styles.drawer : ""
        }`}
      >
        {!props.creatingActivity && (
          <WarningPopup
            selector={`confirm-delete-activity-${props.activity._id}`}
            header={t("activity.delete.header")}
            message={confirmDeleteMessage}
            delete={
              deleting
                ? t("activity.delete.deleting")
                : t("activity.actions.delete")
            }
            deleteClick={onActivityDelete}
            cancel={t("activity.actions.cancel")}
            cancelClick={() => {
              dispatch(popupActions.hidePopup());
            }}
          />
        )}

        <div
          style={{ backgroundColor: categoryColorMap[props.activity.category] }}
          className={styles.categoryStripe}
        ></div>
        <div className={styles.innerContainer}>
          <div
            className={styles.upperContainer}
            style={hasPhotos ? null : noPhotoUpperStyle}
          >
            <div className={styles.photoContainer}>
              {props.activity?.photos && (
                <SixPhotoGrid
                  noRoundedCornerLeft={true}
                  // The drawer starts off-screen: lazy loading held the
                  // photo back until it had slid up
                  eager={!!props.drawer}
                  photos={props.activity.photos}
                  onClick={handleToggleInstructions}
                  onFirstLoad={handleFirstPhotoLoad}
                />
              )}
              {hasPhotos && currentUrl === "/outing" && photoLoaded ? (
                <Buttons
                  {...props}
                  handleSend={handleSend}
                  hasPhotos={hasPhotos}
                  currentUrl={currentUrl}
                  handleUseActivity={handleUseActivity}
                  handleToggleInstructions={handleToggleInstructions}
                  instructionsVisible={instructionsVisible}
                  goState={goState}
                  handleRemove={handleRemove}
                  handleSelect={handleSelect}
                />
              ) : null}
            </div>
            <div
              className={styles.nonPhotoContainer}
              style={hasPhotos ? null : noPhotoContainerStyle}
            >
              {/* Create Activity: category dropdown sits at the top of the card */}
              {props.creatingActivity && props.topSlot ? (
                <div className={styles.topSlot}>{props.topSlot}</div>
              ) : null}
              <div
                className={`${styles.name} ${
                  statsOnTop ? styles.nameWithStats : ""
                }`}
              >
                <div className={styles.innerNameContainer}>
                  <div className={styles.nameText}>{props.activity.name}</div>
                  <div className={styles.location}>
                    {props.activity.location}
                    {statsOnTop ? (
                      <span className={styles.inlineBadges}>{badges}</span>
                    ) : null}
                  </div>
                </div>
                {statsOnTop ? (
                  <div className={styles.topStats}>{statIcons}</div>
                ) : (
                  <div className={styles.nameRightContainer}>{badges}</div>
                )}
              </div>
              <div>
                <div
                  className={`${styles.description} ${
                    statsOnTop ? styles.descriptionOnPhoto : ""
                  }`}
                >
                  {props.activity.description}
                </div>
                {statsOnTop ? null : (
                  <div
                    style={props.creatingActivity ? { padding: 0 } : null}
                    className={styles.specsContainer}
                  >
                    {statIcons}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Drawer: the category colour divides the photo from the
              instructions, as thick as the feed cards' bar */}
          {props.drawer ? (
            <div
              className={styles.dividerStripe}
              style={{
                backgroundColor: categoryColorMap[props.activity.category],
              }}
            />
          ) : null}
          <div
            style={{
              maxHeight:
                instructionsVisible || props.showInstructions ? "200rem" : "0",
            }}
            className={styles.instructionsContainer}
          >
            <div
              className={`${styles.goalLine} ${
                props.creatingActivity ? styles.goalLineCreate : ""
              }`}
            >
              <span className={styles.goalLabel}>{t("activity.goalHeader")}</span>{" "}
              {props.activity.goal}
            </div>
            {props.activity.instructions && props.activity.instructions[0] && (
              <Fragment>
                <div className={styles.iHeader}>{t("activity.instructionsHeader")}</div>
                {props.activity.instructions.map((i, idx) => (
                  <InstructionCard
                    creatingActivity={props.creatingActivity}
                    key={`${i.type ?? ""}${idx}`}
                    instruction={i}
                  />
                ))}
              </Fragment>
            )}
            {props.creatingActivity && (
              <SimpleButton
                onClick={props.creatingActivity && props.onAddInstructionClick}
                noShadow={true}
                className={styles.addInstructionButton}
              >
                {t("activity.addInstruction")}
              </SimpleButton>
            )}
          </div>
          {/* No bottom button bar while creating (it was an empty gap under Goal) */}
          {(hasPhotos && currentUrl === "/outing") || props.creatingActivity ? null : (
            <Fragment>
              <div className={styles.buttonSpacer} />
              {photoLoaded && (
                <Buttons
                  {...props}
                  handleSend={handleSend}
                  currentUrl={currentUrl}
                  handleUseActivity={handleUseActivity}
                  handleToggleInstructions={handleToggleInstructions}
                  instructionsVisible={instructionsVisible}
                  goState={goState}
                  handleRemove={handleRemove}
                  handleSelect={handleSelect}
                />
              )}
            </Fragment>
          )}
        </div>
        {!photoLoaded && <SkeletonCard variant="activity" fill />}
      </div>
    )
  );
};

const Buttons = (props) => {
  const { t } = useT();
  // Social feed / chat popups: "Create Outing" + "Send" instead of the
  // instructions toggle and Select
  const social =
    props.showInstructions &&
    (props.socialActions || props.currentUrl === "/social");
  return (
    <div
      className={`${styles.buttonContainer} ${
        props.hasPhotos ? styles.buttonGradient : styles.plainButtons
      }`}
    >
      {(!props.showInstructions || social) && (
        <SimpleButton
          square={true}
          noShadow={true}
          className={social ? styles.useActivity : styles.instructionsToggle}
          style={{
            boxShadow: "none",
            justifyContent: props.hasPhotos ? "left" : null,
            backgroundColor: props.hasPhotos ? "transparent" : null,
            color: props.hasPhotos ? "white" : null,
          }}
          onClick={
            props.showInstructions
              ? social
                ? props.handleUseActivity
                : null
              : props.handleToggleInstructions
          }
        >
          {!props.showInstructions
            ? !props.instructionsVisible
              ? t("activity.actions.showInstructions")
              : t("activity.actions.hideInstructions")
            : null}
          {social ? (
            <span className={styles.createOutingLabel}>
              {props.hasPhotos ? (
                <img src={balloonLightIcon} alt="" />
              ) : (
                <TintedIcon src={balloonBlueIcon} className={styles.createOutingIcon} />
              )}
              {t("activity.actions.createOuting")}
            </span>
          ) : null}
        </SimpleButton>
      )}

      {social ? (
        <SimpleButton
          square={true}
          noShadow={true}
          onClick={props.handleSend}
          className={styles.sendActivity}
          style={{
            boxShadow: "none",
            justifyContent: props.hasPhotos ? "right" : null,
            backgroundColor: props.hasPhotos ? "transparent" : null,
            color: props.hasPhotos ? "white" : null,
          }}
        >
          {t("activity.actions.sendToFriend")}
        </SimpleButton>
      ) : null}

      {props.hideSelect ? null : props.goState.outing.activity?.name ===
        props.activity.name ? (
        <SimpleButton
          square={true}
          noShadow={true}
          onClick={props.handleRemove}
          className={styles.remove}
          style={{
            boxShadow: "none",
            justifyContent: props.hasPhotos ? "right" : null,
            backgroundColor: props.hasPhotos ? "transparent" : null,
            color: props.hasPhotos ? "white" : null,
          }}
        >
          {t("activity.actions.remove")}
        </SimpleButton>
      ) : (
        <SimpleButton
          square={true}
          noShadow={true}
          onClick={props.handleSelect}
          className={styles.select}
          style={{
            boxShadow: "none",
            justifyContent: props.hasPhotos ? "right" : null,
            backgroundColor: props.hasPhotos ? "transparent" : null,
            color: props.hasPhotos ? "white" : null,
          }}
        >
          {t("activity.actions.select")}
        </SimpleButton>
      )}
    </div>
  );
};

export default ActivityCard;
