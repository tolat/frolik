import StatIcon from "./StatIcon";
import styles from "./styles/ActivityCard.module.scss";
import timeIcon from "../../images/clock.png";
import costIcon from "../../images/bill.png";
import ratingIcon from "../../images/star.png";
import groupIcon from "../../images/friends.png";
import { categoryColorMap } from "../../utils/globals";
import SimpleButton from "./SimpleButton";
import { useState } from "react";
import travelIcon from "../../images/walk.png";
import communicateIcon from "../../images/talking.png";
import purchaseIcon from "../../images/cart.png";
import captureIcon from "../../images/camera.png";
import trophyIcon from "../../images/trophy.png";
import completeIcon from "../../images/complete.png";
import featuredIcon from "../../images/feature.png"
import { calcAvgRating } from "../../utils/utils";

const instructionIconMap = {
  communicate: communicateIcon,
  travel: travelIcon,
  purchase: purchaseIcon,
  capture: captureIcon,
};

const ActivityCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const handleShowInstructions = (e) => {
    setInstructionsVisible((prev) => !prev);
  };

  return (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[props.activity.category] }}
        className={styles.categoryStripe}
      ></div>
      <div className={styles.innerContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.name}>
            {props.activity.name}
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
            </div>
          </div>
          <div className={styles.description}>{props.activity.description}</div>
          <div className={styles.specsContainer}>
            <StatIcon
              alt="time"
              icon={timeIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${props.activity.duration} hrs`}
            />
            <StatIcon
              alt="cost"
              icon={costIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`$${props.activity.cost}`}
            />
            <StatIcon
              alt="group"
              icon={groupIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${props.activity.participants} +`}
            />
            <StatIcon
              alt="rating"
              icon={ratingIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={`${calcAvgRating(props.activity)}/5`}
            />
          </div>
        </div>
        <div
          style={{
            maxHeight: instructionsVisible ? "40rem" : "0",
          }}
          className={styles.instructionsContainer}
        >
          <div className={styles.iHeader}>Instructions:</div>

          {props.activity.instructions.map((i) => (
            <InstructionCard key={Math.random()} instruction={i} />
          ))}
          <div className={styles.iHeader}>Goal:</div>
          <div className={styles.goalContainer}>
            <img className={styles.goalIcon} src={trophyIcon} alt="goalIcon" />
            <div className={styles.goal}>{props.activity.goal}</div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <SimpleButton onClick={handleShowInstructions}>
            {!instructionsVisible ? "Show Instructions" : "Hide Instructions"}
          </SimpleButton>
          <SimpleButton className={styles.select}>Select</SimpleButton>
        </div>
      </div>
    </div>
  );
};

const InstructionCard = (props) => {
  return (
    <div className={styles.iContainer}>
      <div className={styles.iIconContainer}>
        <img
          src={instructionIconMap[props.instruction.kind]}
          className={styles.iIcon}
          alt={`${props.instruction.name}`}
        />
      </div>
      <div className={styles.iRightContainer}>
        <div className={styles.iName}>{`${props.instruction.title}`}</div>
        <div className={styles.iDetails}>{props.instruction.details}</div>
      </div>
    </div>
  );
};

export default ActivityCard;
