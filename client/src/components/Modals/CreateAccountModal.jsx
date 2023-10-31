import styles from "./styles/CreateAccountModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import ProfileEditor from "./ProfileEditor";
import placeholderPhoto from "../../images/placeholder-user-photo.png";
import SimpleInput from "../UI/SimpleInput";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { createAccount, fetchGobals } from "../../utils/data-fetch";
import { loadImageAsBase64 } from "../../utils/utils";
import { createProfileValidators } from "../../utils/validators";

const stagedDataReducer = (state, action) => {
  return action.type === "setAll"
    ? action.values
    : { ...state, [`${action.id}`]: action.value };
};

const CreateAccountModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-account" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const [stagedData, dispatchStageData] = useReducer(stagedDataReducer, {});
  const [buttonText, setButtonText] = useState("Create Profile");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [defaultImage, setDefaultImage] = useState(false);
  const [allowCrop, setAllowCrop] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const [globals, setGlobals] = useState({});
  const buttonTextOnSubmit = "Creating Profile..";
  const validatorBubbleID = "validator-bubble";

  // Set memoized default values based on user data
  const defaultValues = useMemo(() => {
    return {
      location: "",
      first_name: "",
      last_name: "",
      tagline: "",
      profile_picture: defaultImage,
      "create-email": "",
      "create-password": "",
      crop: { x: 0, y: 0 },
      zoom: 1,
    };
  }, [defaultImage]);

  // Initialize the staged data reducer state with the default values
  // and get globals from server
  useEffect(() => {
    dispatchStageData({ type: "setAll", values: defaultValues });
    fetchGobals(setGlobals);
    loadImageAsBase64(placeholderPhoto, setDefaultImage);
  }, [defaultValues]);

  // Data has been changed if stagedData values differ from defaultValues
  const dataChanged = !stagedData
    ? false
    : Object.keys(stagedData)?.find(
        (key) => stagedData[key] !== defaultValues[key]
      );

  const onPhotoChange = (newImage) => {
    newImage !== defaultImage ? setAllowCrop(true) : setAllowCrop(false);
  };

  const runValidation = () => {
    return runValidators(
      createProfileValidators(globals, defaultImage),
      stagedData,
      setValidationMessage,
      setValidationDisplay,
      setValidationID,
      validatorBubbleID
    );
  };

  const resetForm = () => {
    setButtonText("Create Acount");
  };

  const onSubmit = async (data) => {
    createAccount(
      {
        ...data,
        username: stagedData["create-email"],
        password: stagedData["create-password"],
      },
      resetForm
    );
  };

  return (
    <ModalPortal>
      <div className={styles.container} style={modalStyle}>
        <ValidatorBubble
          id={validatorBubbleID}
          elementID={validationID}
          display={validationDisplay}
          message={validationMessage}
        />
        <ProfileEditor
          stagedData={stagedData}
          dispatchStageData={dispatchStageData}
          buttonText={buttonText}
          setButtonText={setButtonText}
          buttonTextOnSubmit={buttonTextOnSubmit}
          editingPhoto={editingPhoto}
          setEditingPhoto={setEditingPhoto}
          onSubmit={onSubmit}
          onPhotoChange={onPhotoChange}
          allowCrop={allowCrop}
          defaultValues={defaultValues}
          dataChanged={dataChanged}
          runValidation={runValidation}
          clearValidators={() => setValidationDisplay("none")}
          resetForm={resetForm}
        >
          <SimpleInput
            type="text"
            id="create-email"
            name="email"
            label="Email:"
            defaultVal={defaultValues["create-email"]}
            className={styles.simpleInput}
            setDataChanged={(value) => {
              dispatchStageData({ id: "create-email", value });
            }}
          />
          <SimpleInput
            type="password"
            id="create-password"
            name="password"
            label="Password:"
            defaultVal={defaultValues["create-password"]}
            className={styles.simpleInput}
            setDataChanged={(value) => {
              dispatchStageData({ id: "create-password", value });
            }}
          />
        </ProfileEditor>
      </div>
    </ModalPortal>
  );
};

export default CreateAccountModal;
