import { useDispatch, useSelector } from "react-redux";
import ModalPortal from "./ModalPortal";
import styles from "./styles/CreateActivityModal.module.scss";
import modalStyles from "./styles/SlideInModal.module.scss";
import SimpleInput from "../UI/SimpleInput";
import CustomAutocomplete from "../UI/CustomAutocomplete";
import cityData from "../../utils/cities100000";
import ActivityCard from "../UI/ActivityCard";
import SimpleSelect from "../UI/SimpleSelect";
import { useRef, useState } from "react";
import SimpleButton from "../UI/SimpleButton";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { createActivityValidators } from "../../utils/validators";
import { genRandomChars } from "../../utils/utils";
import { createActivity } from "../../utils/data-fetch";
import { hideModal } from "../../store/modal-actions";
import { goActions } from "../../store/go-slice";

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
  const [createButtonText, setCreatebuttonText] = useState("+ Create");
  const dispatch = useDispatch();

  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const validatorBubbleID = "validator-bubble";

  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const goalRef = useRef();
  const durationRef = useRef();
  const costRef = useRef();
  const participantsRef = useRef();

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
      kind: instructionTypes[0],
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
        ref={nameRef}
        defaultVal={""}
        placeholder="Name"
      />
    ),
    description: (
      <SimpleInput
        ref={descriptionRef}
        defaultVal={""}
        placeholder="Description"
        id={`create-activity-description`}
      />
    ),
    location: (
      <CustomAutocomplete
        id={`create-activity-location`}
        ref={locationRef}
        options={cityData}
        name={"Activity Location"}
        className={styles.locationSelect}
        defaultVal={""}
        placeholder="Location"
        setDataChanged={(value) => {}}
      />
    ),
    instructions,
    goal: (
      <SimpleInput
        id={`create-activity-goal`}
        ref={goalRef}
        defaultVal={""}
        placeholder="Enter goal"
      />
    ),
    category,
    duration: (
      <SimpleInput
        id={`create-activity-duration`}
        className={styles.iconInput}
        ref={durationRef}
        defaultVal={""}
        type="number"
        placeholder="Duration"
      />
    ),
    cost: (
      <SimpleInput
        ref={costRef}
        defaultVal={""}
        type="number"
        placeholder="Cost"
        id={`create-activity-cost`}
        className={styles.iconInput}
      />
    ),
    participants: (
      <SimpleInput
        ref={participantsRef}
        defaultVal={""}
        type="number"
        placeholder="Participants"
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
      validatorBubbleID
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let newActivity = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      location: locationRef.current.value,
      goal: goalRef.current.value,
      duration: durationRef.current.value,
      cost: costRef.current.value,
      participants: participantsRef.current.value,
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
      const kind = document.querySelector(`#${id}-kind select`).value;
      const title = document.querySelector(`#${id}-title input`).value;
      const details = document.querySelector(`#${id}-details`).value;
      newActivity.instructions.push({
        kind,
        title,
        number: i,
        details,
      });

      validationIDMap[`${inst.instructionID}-kind`] = kind;
      validationIDMap[`${inst.instructionID}-title`] = title;
      validationIDMap[`${inst.instructionID}-details`] = details;
    }

    if (runValidation(validationIDMap, instructions)) {
      const onComplete = async (response) => {
        setCreatebuttonText("+ Create");
        if (response.activity) {
          // Reset form
          setInstructions([]);
          nameRef.current.value = "";
          descriptionRef.current.value = "";
          locationRef.current.value = "";
          goalRef.current.value = "";
          durationRef.current.value = "";
          costRef.current.value = "";
          participantsRef.current.value = "";
          await hideModal();
        }

        dispatch(goActions.setActivity(response.activity));
        props.addActivity(response.activity);
      };

      setCreatebuttonText("Creating..");
      createActivity(user, newActivity, onComplete);
    }
  };

  return (
    <ModalPortal>
      <ValidatorBubble
        id={validatorBubbleID}
        elementID={validationID}
        display={validationDisplay}
        setDisplay={setValidationDisplay}
        message={validationMessage}
      />
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Create Activity</div>
        <form id="create-activity-form" className={styles.createForm}>
          <SimpleButton onClick={onSubmit} className={styles.createButton}>
            {createButtonText}
          </SimpleButton>
          <SimpleSelect
            className={styles.categoryInput}
            options={Object.keys(categoryColorMap)}
            label="Activity Category:"
            setDataChanged={(value) => setCategory(value)}
          />
          <ActivityCard
            showInstructions={true}
            hideSelect={true}
            creatingActivity={true}
            activity={newActivity}
            onAddInstructionClick={onAddInstructionClick}
          />
        </form>
      </div>
    </ModalPortal>
  );
};

export default CreateActivityModal;
