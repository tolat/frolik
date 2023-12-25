import StatIcon from "./StatIcon";
import styles from "./styles/ActivityCard.module.scss";
import timeIcon from "../../images/clock.png";
import costIcon from "../../images/bill.png";
import ratingIcon from "../../images/star.png";
import groupIcon from "../../images/friends.png";
import SimpleButton from "./SimpleButton";
import { Fragment, useState } from "react";
import trophyIcon from "../../images/trophy.png";
import completeIcon from "../../images/complete.png";
import featuredIcon from "../../images/feature.png";
import creationIcon from "../../images/sketch.png";
import { calcAvgRating } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { goActions } from "../../store/go-slice";
import InstructionCard from "./InstructionCard";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import { deleteActivity } from "../../utils/data-fetch";

const ActivityCard = (props) => {
  const categoryColorMap = useSelector(
    (state) => state.auth.globals.categoryColorMap
  );
  const statIconStyle = { width: "2rem", height: "2rem" };
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const dispatch = useDispatch();
  const goState = useSelector((state) => state.go);
  const user = useSelector((state) => state.auth.user);
  const [deleteText, setDeleteText] = useState("Delete");

  const handleToggleInstructions = (e) => {
    setInstructionsVisible((prev) => !prev);
  };

  const handleSelect = () => {
    dispatch(goActions.setActivity(props.activity));
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
      <div className={styles.warningText}>This action is permanent.</div>
    </div>
  );

  const onActivityDelete = () => {
    const onComplete = () => {
      setDeleteText("Delete");
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

    setDeleteText("Deleting..");
    deleteActivity(user, props.activity, onComplete);
  };

  return (
    categoryColorMap && (
      <div style={props.style} className={styles.outerContainer}>
        <WarningPopup
          selector={`confirm-delete-activity-${props.activity._id}`}
          header={"Confirm Delete Activity:"}
          message={confirmDeleteMessage}
          delete={deleteText}
          deleteClick={onActivityDelete}
          cancel={"Cancel"}
          cancelClick={() => {
            dispatch(popupActions.hidePopup());
          }}
        />
        <div
          style={{ backgroundColor: categoryColorMap[props.activity.category] }}
          className={styles.categoryStripe}
        ></div>
        <div className={styles.innerContainer}>
          <div className={styles.upperContainer}>
            <div className={styles.name}>
              <div className={styles.innerNameContainer}>
                {props.activity.name}{" "}
                <div className={styles.location}>{props.activity.location}</div>
              </div>
              <div className={styles.nameRightContainer}>
                {props.completed ? (
                  <div className={styles.completedIconContainer}>
                    <img
                      src={completeIcon}
                      className={styles.completedIcon}
                      alt="completed-icon"
                    />
                  </div>
                ) : null}
                {props.activity.featured ? (
                  <div className={styles.completedIconContainer}>
                    <img
                      src={featuredIcon}
                      className={styles.completedIcon}
                      alt="completed-icon"
                    />
                  </div>
                ) : null}
                {props.activity.created_by ? (
                  <Fragment>
                    <div className={styles.completedIconContainer}>
                      <img
                        src={creationIcon}
                        className={styles.completedIcon}
                        alt="creation-icon"
                      />
                    </div>
                    <SimpleButton
                      noShadow={true}
                      onClick={handleDeleteActivity}
                      className={styles.deleteActivityButton}
                    >
                      Delete
                    </SimpleButton>
                  </Fragment>
                ) : null}
              </div>
            </div>
            <div>
              <div className={styles.description}>
                {props.activity.description}
              </div>
              <div
                style={props.creatingActivity ? { padding: 0 } : null}
                className={styles.specsContainer}
              >
                <StatIcon
                  alt="time"
                  icon={timeIcon}
                  iconStyle={statIconStyle}
                  rating={
                    props.creatingActivity
                      ? props.activity.duration
                      : `${props.activity.duration} hrs`
                  }
                />
                <div className={styles.spacer} />
                <StatIcon
                  alt="cost"
                  icon={costIcon}
                  iconStyle={statIconStyle}
                  rating={
                    props.creatingActivity
                      ? props.activity.cost
                      : `$${props.activity.cost}`
                  }
                />
                <div className={styles.spacer} />
                <StatIcon
                  alt="group"
                  icon={groupIcon}
                  iconStyle={statIconStyle}
                  rating={
                    props.creatingActivity
                      ? props.activity.participants
                      : `${props.activity.participants} +`
                  }
                />
                {!props.creatingActivity && (
                  <Fragment>
                    <div className={styles.spacer} />
                    <StatIcon
                      alt="rating"
                      icon={ratingIcon}
                      iconStyle={statIconStyle}
                      rating={calcAvgRating(props.activity)}
                    />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              maxHeight:
                instructionsVisible || props.showInstructions ? "80rem" : "0",
            }}
            className={styles.instructionsContainer}
          >
            {props.activity.instructions && props.activity.instructions[0] && (
              <Fragment>
                <div className={styles.iHeader}>Instructions:</div>
                {props.activity.instructions.map((i) => (
                  <InstructionCard
                    creatingActivity={props.creatingActivity}
                    key={Math.random()}
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
                + Add Instruction
              </SimpleButton>
            )}
            <div className={styles.iHeader}>Goal:</div>
            <div className={styles.goalContainer}>
              <img
                className={styles.goalIcon}
                src={trophyIcon}
                alt="goalIcon"
              />
              <div className={styles.goal}>{props.activity.goal}</div>
            </div>
          </div>
          <div className={styles.buttonSpacer}></div>
          <div className={styles.buttonContainer}>
            {!props.showInstructions && (
              <SimpleButton
                noShadow={true}
                style={{ boxShadow: "none" }}
                onClick={
                  props.showInstructions ? null : handleToggleInstructions
                }
              >
                {!props.showInstructions
                  ? !instructionsVisible
                    ? "Show Instructions"
                    : "Hide Instructions"
                  : null}
              </SimpleButton>
            )}

            {props.hideSelect ? null : goState.outing.activity.name ===
              props.activity.name ? (
              <SimpleButton
                noShadow={true}
                onClick={handleRemove}
                className={styles.remove}
              >
                Remove
              </SimpleButton>
            ) : (
              <SimpleButton
                noShadow={true}
                onClick={handleSelect}
                className={styles.select}
              >
                Select
              </SimpleButton>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ActivityCard;
