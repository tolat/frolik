import { useSelector } from "react-redux";
import styles from "./styles/InstructionCard.module.scss";
import { useState } from "react";
import travelIcon from "../../images/walk.png";
import communicateIcon from "../../images/talking.png";
import purchaseIcon from "../../images/cart.png";
import captureIcon from "../../images/camera.png";
import whistleIcon from "../../images/whistle.png";
import createIcon from "../../images/paint.png";
import SimpleInput from "./SimpleInput";
import SimpleButton from "./SimpleButton";
import CustomSelect from "./CustomSelect";
import { capitalizeFirstLetter } from "../../utils/utils";

const instructionIconMap = {
  communicate: communicateIcon,
  travel: travelIcon,
  purchase: purchaseIcon,
  capture: captureIcon,
  play: whistleIcon,
  create: createIcon,
};

const InstructionCard = (props) => {
  const globals = useSelector((state) => state.auth.globals);
  const instructionTypes = globals?.instructionTypes;
  const [kind, setKind] = useState(props.instruction.kind);
  const [title, setTitle] = useState(props.instruction.title);
  const [details, setDetails] = useState(props.instruction.details);

  const handleKindChange = (value) => {
    setKind(value);
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

  const instructionTypeOptions = instructionTypes.map((name) => {
    return {
      selectable: true,
      name: capitalizeFirstLetter(name.toLowerCase()),
    };
  });

  return (
    <div className={styles.iContainer}>
      <div
        style={props.creatingActivity ? { paddingTop: "3rem" } : null}
        className={styles.iIconContainer}
      >
        <img
          src={instructionIconMap[`${kind.toLowerCase()}`]}
          className={styles.iIcon}
          alt={props.instruction.kind}
        />
      </div>
      <div className={styles.iRightContainer}>
        {props.creatingActivity && (
          <CustomSelect
            id={`${props.instruction.instructionID}-kind`}
            placeholder="Type"
            options={instructionTypeOptions}
            defaultVal={kind}
            label="Instruction Type:"
            inputClassName={styles.selectKindInput}
            setDataChanged={handleKindChange}
            
          />
        )}
        <div className={styles.iName}>
          {props.creatingActivity ? (
            <SimpleInput
              defaultVal={title}
              id={`${props.instruction.instructionID}-title`}
              style={{ margin: "1rem 0" }}
              placeholder="Instruction Title"
              setDataChanged={setTitle}
              onBlur={handleTitleBlur}
            />
          ) : (
            props.instruction.title
          )}
        </div>
        <div className={styles.iDetails}>
          {props.creatingActivity ? (
            <textarea
              id={`${props.instruction.instructionID}-details`}
              rows={3}
              className={styles.instructionDetails}
              defaultValue={details}
              placeholder="Instruction Details"
              onChange={(e) => setDetails(e.target.value)}
              onBlur={(e) => handleDetailsBlur(e.target.value)}
            />
          ) : (
            props.instruction.details
          )}
        </div>
        {props.creatingActivity && (
          <SimpleButton
            noShadow={true}
            className={styles.deleteInstructionButton}
            onClick={onDeleteInstruction}
          >
            Delete Instruction
          </SimpleButton>
        )}
      </div>
    </div>
  );
};

export default InstructionCard;
