import styles from "./styles/InstructionCard.module.scss";
import { useState } from "react";
import travelIcon from "../../images/walk.png";
import communicateIcon from "../../images/talking.png";
import purchaseIcon from "../../images/cart.png";
import captureIcon from "../../images/camera.png";
import whistleIcon from "../../images/whistle.png";
import createIcon from "../../images/paint.png";
import eatIcon from "../../images/eat.png";
import meetIcon from "../../images/meet.png";
import exploreIcon from "../../images/explore.png";
import SimpleInput from "./SimpleInput";
import { INSTRUCTION_TITLE_MAX } from "../../utils/limits";
import { useT } from "../../i18n";

// Icons for activity steps, in picker order (a 3 x 3 grid). New kinds also
// go in routes/activity.js INSTRUCTION_KINDS and data.instructionTypes.
export const instructionIconMap = {
  communicate: communicateIcon,
  meet: meetIcon,
  travel: travelIcon,
  explore: exploreIcon,
  purchase: purchaseIcon,
  eat: eatIcon,
  play: whistleIcon,
  capture: captureIcon,
  create: createIcon,
};

const InstructionCard = (props) => {
  const { t, tOr } = useT();
  // The kinds are now just icons: pick one, then write any short title
  // Every icon the app has (the database's older list only had six)
  const iconKinds = Object.keys(instructionIconMap);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [kind, setKind] = useState(props.instruction.kind);
  const [title, setTitle] = useState(props.instruction.title);
  const [details, setDetails] = useState(props.instruction.details);

  const handleKindChange = (value) => {
    setKind(value);
    setPickerOpen(false);
    props.instruction.setData("kind", value);
  };

  const handleTitleBlur = (value) => {
    setTitle(value);
    props.instruction.setData("title", value);
  };

  const handleDetailsBlur = (value) => {
    setDetails(value);
    props.instruction.setData("details", value);
  };

  const onDeleteInstruction = (e) => {
    e.preventDefault();
    props.instruction.deleteInstruction(props.instruction.instructionID);
  };

  const iconSrc = instructionIconMap[`${kind || ""}`.toLowerCase()];

  if (props.creatingActivity) {
    return (
      <div className={styles.editContainer}>
        <div className={styles.editTopRow}>
          {/* Icon picker, left of the title */}
          <div
            className={styles.iconPicker}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setPickerOpen(false);
            }}
          >
            <button
              type="button"
              id={`${props.instruction.instructionID}-kind`}
              data-kind={kind}
              className={styles.iconPickerButton}
              aria-label={t("activity.instruction.chooseIcon")}
              aria-expanded={pickerOpen}
              onClick={() => setPickerOpen((o) => !o)}
            >
              <img src={iconSrc} alt="" />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10l5 5 5-5" />
              </svg>
            </button>
            {pickerOpen ? (
              <div className={styles.iconMenu} role="listbox">
                {iconKinds.map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="option"
                    aria-selected={k === `${kind}`.toLowerCase()}
                    aria-label={tOr("data.instructionTypes." + k, k)}
                    title={tOr("data.instructionTypes." + k, k)}
                    className={`${styles.iconOption} ${
                      k === `${kind}`.toLowerCase() ? styles.iconOptionOn : ""
                    }`}
                    onClick={() => handleKindChange(k)}
                  >
                    <img src={instructionIconMap[k]} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <SimpleInput
            defaultVal={title}
            id={`${props.instruction.instructionID}-title`}
            className={styles.titleInput}
            placeholder={t("activity.instruction.titlePlaceholder")}
            maxLength={INSTRUCTION_TITLE_MAX}
            suffix={
              title ? `${title.length}/${INSTRUCTION_TITLE_MAX}` : null
            }
            setDataChanged={setTitle}
            onBlur={handleTitleBlur}
          />
        </div>
        <textarea
          id={`${props.instruction.instructionID}-details`}
          rows={3}
          className={styles.instructionDetails}
          defaultValue={details}
          placeholder={t("activity.instruction.detailsPlaceholder")}
          onChange={(e) => setDetails(e.target.value)}
          onBlur={(e) => handleDetailsBlur(e.target.value)}
        />
        <button
          type="button"
          className={styles.deleteInstructionButton}
          onClick={onDeleteInstruction}
        >
          {t("activity.instruction.remove")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.iContainer}>
      <div className={styles.iIconContainer}>
        <img src={iconSrc} className={styles.iIcon} alt={tOr(
            "data.instructionTypes." + `${props.instruction.kind || ""}`.toLowerCase(),
            props.instruction.kind
          )}
        />
      </div>
      <div className={styles.iRightContainer}>
        <div className={styles.iName}>{props.instruction.title}</div>
        <div className={styles.iDetails}>{props.instruction.details}</div>
      </div>
    </div>
  );
};

export default InstructionCard;
