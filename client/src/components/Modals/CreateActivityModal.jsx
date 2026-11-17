import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/CreateActivityModal.module.scss";
import SimpleInput from "../UI/SimpleInput";
import LocationAutocomplete from "../UI/LocationAutocomplete";
import ActivityCard from "../UI/ActivityCard";
import { useRef, useState } from "react";
import { fileToResizedDataURL } from "../../utils/imageResize";
import SimpleButton from "../UI/SimpleButton";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { createActivityValidators } from "../../utils/validators";
import { genRandomChars } from "../../utils/utils";
import { createActivity } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { goActions } from "../../store/go-slice";
import CustomSelect from "../UI/CustomSelect";
import LoaderSpinner from "../UI/LoaderSpinner";
import ModalHeaderPortal from "./ModalHeaderPortal";
import {
  ACTIVITY_NAME_MAX,
  ACTIVITY_DESCRIPTION_MAX,
} from "../../utils/limits";

const CreateActivityModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-activity" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const globals = useSelector((state) => state.auth.globals);
  const categoryColorMap = globals?.categoryColorMap;
  const [category, setCategory] = useState("Adventure");
  const [instructions, setInstructions] = useState([]);
  const instructionTypes = globals?.instructionTypes;
  const [createButtonText, setCreatebuttonText] = useState("Create Activity");
  const dispatch = useDispatch();

  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const [validationPosition, setValidationPosition] = useState(false);
  const validatorBubbleID = "validator-bubble";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [participants, setParticipants] = useState("");
  const [goal, setGoal] = useState("");

  // Optional cover photo, already shrunk to a JPEG data URL
  const [cover, setCover] = useState(null);
  const [coverError, setCoverError] = useState("");
  const coverInputRef = useRef(null);
  const onCoverPicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again
    if (!file) return;
    try {
      setCoverError("");
      setCover(await fileToResizedDataURL(file));
    } catch {
      setCoverError("That file couldn't be read as an image.");
    }
  };

  const onAddInstructionClick = (e) => {
    e.preventDefault();

    const instructionID = `instruction-${genRandomChars(12)}`;

    const setData = (key, data) => {
      setInstructions((prevState) => {
        const newState = [...prevState];
        const instruction = newState.find(
          (inst) => inst.instructionID === instructionID
        );
        instruction[key] = data;
        return newState;
      });
    };

    const deleteInstruction = (instructionID) => {
      setInstructions((prevState) => {
        const newState = [...prevState].filter(
          (inst) => inst.instructionID !== instructionID
        );
        return newState;
      });
    };

    const newInstruction = {
      kind: (instructionTypes?.[0] || "communicate").toLowerCase(),
      instructionID: instructionID,
      title: "",
      details: "",
      setData,
      deleteInstruction,
    };

    setInstructions((prevState) => {
      const newState = [...prevState, newInstruction];
      return newState;
    });
  };

  const newActivity = {
    name: (
      <SimpleInput
        id={`create-activity-name`}
        defaultVal={name}
        placeholder={`Name (max ${ACTIVITY_NAME_MAX} characters)`}
        maxLength={ACTIVITY_NAME_MAX}
        suffix={name ? `${name.length}/${ACTIVITY_NAME_MAX}` : null}
        setDataChanged={setName}
      />
    ),
    description: (
      <SimpleInput
        setDataChanged={setDescription}
        defaultVal={description}
        placeholder={`Description (max ${ACTIVITY_DESCRIPTION_MAX} characters)`}
        maxLength={ACTIVITY_DESCRIPTION_MAX}
        suffix={
          description
            ? `${description.length}/${ACTIVITY_DESCRIPTION_MAX}`
            : null
        }
        id={`create-activity-description`}
      />
    ),
    location: (
      <LocationAutocomplete
        id={`create-activity-location`}
        name={"Activity Location"}
        className={styles.locationSelect}
        defaultVal={location}
        placeholder="City"
        setDataChanged={setLocation}
      />
    ),
    instructions,
    goal: (
      <SimpleInput
        id={`create-activity-goal`}
        setDataChanged={setGoal}
        defaultVal={goal}
        placeholder="Enter goal"
      />
    ),
    category,
    duration: (
      <SimpleInput
        id={`create-activity-duration`}
        className={styles.iconInput}
        setDataChanged={setDuration}
        defaultVal={duration}
        type="number"
        placeholder="# Hours"
      />
    ),
    cost: (
      <SimpleInput
        setDataChanged={setCost}
        defaultVal={cost}
        type="number"
        placeholder="$ Cost"
        id={`create-activity-cost`}
        className={styles.iconInput}
      />
    ),
    participants: (
      <SimpleInput
        setDataChanged={setParticipants}
        defaultVal={participants}
        type="number"
        placeholder="# People"
        id={`create-activity-participants`}
        className={styles.iconInput}
      />
    ),
  };

  const runValidation = (idMap) => {
    return runValidators(
      createActivityValidators(instructions),
      idMap,
      setValidationMessage,
      setValidationDisplay,
      setValidationID,
      setValidationPosition,
      validatorBubbleID
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let newActivity = {
      name,
      description,
      location,
      goal,
      duration,
      cost,
      participants,
      category,
      instructions: [],
    };

    let validationIDMap = {
      "create-activity-name": newActivity.name,
      "create-activity-description": newActivity.description,
      "create-activity-location": newActivity.location,
      "create-activity-goal": newActivity.goal,
      "create-activity-duration": newActivity.duration,
      "create-activity-cost": newActivity.cost,
      "create-activity-participants": newActivity.participants,
      "create-activity-category": newActivity.category,
      instructions: [],
    };

    for (let i = 0; i < instructions.length; i++) {
      const inst = instructions[i];
      const id = inst.instructionID;
      const kind = inst.kind || "communicate"; // icon key, from the picker
      const title = document.querySelector(`#${id}-title input`).value;
      const details = document.querySelector(`#${id}-details`).value;
      newActivity.instructions.push({
        kind: kind.toLowerCase(),
        title,
        number: i,
        details,
      });

      validationIDMap[`${inst.instructionID}-kind`] = kind.toLowerCase();
      validationIDMap[`${inst.instructionID}-title`] = title;
      validationIDMap[`${inst.instructionID}-details`] = details;
    }

    if (runValidation(validationIDMap, instructions)) {
      const onComplete = async (response) => {
        setCreatebuttonText("Create Activity");
        if (!!response.activity) {
          // Reset form
          setInstructions([]);
          setName("");
          setDescription("");
          setLocation("");
          setGoal("");
          setCover(null);
          setDuration("");
          setCost("");
          setParticipants("");
          await hideModal();
        }

        dispatch(goActions.setActivity(response.activity));
        props.addActivity(response.activity);
      };

      setCreatebuttonText(
        <div style={{ display: "flex" }}>
          Saving &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
        </div>
      );
      createActivity(user, newActivity, onComplete, cover || undefined);
    }
  };

  const categoryOptions =
    categoryColorMap &&
    Object.keys(categoryColorMap).map((key) => {
      return {
        selectable: true,
        name: key,
      };
    });

  return (
    categoryOptions && (
      <ModalPortal>
        <ValidatorBubble
          id={validatorBubbleID}
          elementID={validationID}
          display={validationDisplay}
          setDisplay={setValidationDisplay}
          position={validationPosition}
          message={validationMessage}
        />
        <div style={modalStyle} className={styles.container}>
        <ModalHeaderPortal selector={'create-activity'}>Create Activity</ModalHeaderPortal>

          <form id="create-activity-form" className={styles.createForm}>
            <ActivityCard
              showInstructions={true}
              hideSelect={true}
              creatingActivity={true}
              activity={newActivity}
              onAddInstructionClick={onAddInstructionClick}
              topSlot={
                <>
                  <CustomSelect
                    className={styles.categoryInput}
                    options={categoryOptions}
                    defaultVal={categoryOptions[0].name}
                    setDataChanged={(value) => setCategory(value)}
                  />
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onCoverPicked}
                    style={{ display: "none" }}
                  />
                  {cover ? (
                    <div className={styles.coverPreview}>
                      <img src={cover} alt="Activity cover" />
                      <div className={styles.coverActions}>
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          Change
                        </button>
                        <button type="button" onClick={() => setCover(null)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.coverPicker}
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <circle cx="9" cy="10" r="1.8" />
                        <path d="M21 16l-5-5-8 8" />
                      </svg>
                      Add a cover photo
                      <span>optional</span>
                    </button>
                  )}
                  {coverError ? (
                    <div className={styles.coverError}>{coverError}</div>
                  ) : null}
                </>
              }
            />
            <SimpleButton onClick={onSubmit} className={styles.createButton}>
              {createButtonText}
            </SimpleButton>
          </form>
        </div>
      </ModalPortal>
    )
  );
};

export default CreateActivityModal;
