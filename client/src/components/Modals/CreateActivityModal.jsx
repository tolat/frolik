import { useSelector } from "react-redux";
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

  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const goalRef = useRef();
  const durationRef = useRef();
  const costRef = useRef();
  const participantsRef = useRef();

  const genRandomChars = (length) => {
    const alphabet = "qwertyuiopasdfghjklzxcvbnm".split("");
    let string = "";
    for (let i = 0; i < length; i++) {
      const randIndex =
        ((Math.random() * 10000) % alphabet.length).toFixed(0) - 1;
      string = string.concat(alphabet[randIndex]);
    }

    return string;
  };

  const onAddInstructionClick = (e) => {
    e.preventDefault();

    const instructionID = `instruction-${genRandomChars(12)}`;

    const newInstruction = {
      kind: instructionTypes[0],
      instructionID: instructionID,
      title: (
        <SimpleInput
          id={`${instructionID}-title`}
          defaultVal={""}
          style={{ margin: "1rem 0" }}
          placeholder="Instruction Title"
        />
      ),
      details: (
        <textarea
          id={`${instructionID}-details`}
          rows={3}
          className={styles.instructionDetails}
          placeholder="Instruction Details"
        />
      ),
      deleteInstruction: (instructionID) => {
        setInstructions((prevState) => {
          const newState = [...prevState].filter(
            (inst) => inst.instructionID !== instructionID
          );
          return newState;
        });
      },
    };

    setInstructions((prevState) => {
      const newState = [...prevState, newInstruction];
      return newState;
    });
  };

  const newActivity = {
    name: <SimpleInput ref={nameRef} defaultVal={""} placeholder="Name" />,
    description: (
      <SimpleInput
        ref={descriptionRef}
        defaultVal={""}
        placeholder="Description"
      />
    ),
    location: (
      <CustomAutocomplete
        ref={locationRef}
        options={cityData}
        name={"Activity Location"}
        id={"location"}
        className={styles.locationSelect}
        defaultVal={""}
        placeholder="Location"
        setDataChanged={(value) => {}}
      />
    ),
    instructions,
    goal: (
      <SimpleInput ref={goalRef} defaultVal={""} placeholder="Enter goal" />
    ),
    category,
    duration: (
      <SimpleInput
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
      />
    ),
    participants: (
      <SimpleInput
        ref={participantsRef}
        defaultVal={""}
        type="number"
        placeholder="Participants"
      />
    ),
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

    for (let i = 0; i < instructions.length; i++) {
      const inst = instructions[i];
      newActivity.instructions.push({
        kind: document.querySelector(`#${inst.instructionID}-kind select`)
          .value,
        title: document.querySelector(`#${inst.instructionID}-title input`)
          .value,
        number: i,
        details: document.querySelector(`#${inst.instructionID}-details`).value,
      });
    }

    console.log(newActivity);
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={styles.container}>
        <div className={modalStyles.header}>Create Activity</div>
        <form id="create-activity-form" className={styles.createForm}>
          <SimpleButton onClick={onSubmit} className={styles.createButton}>
            + Create
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
