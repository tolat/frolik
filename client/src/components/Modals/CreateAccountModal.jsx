import styles from "./styles/CreateAccountModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileEditor from "./ProfileEditor";
import placeholderPhoto from "../../images/placeholder-user-photo.png";
import SimpleInput from "../UI/SimpleInput";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { createAccount, resendVerificationEmail } from "../../utils/data-fetch";
import { createProfileValidators } from "../../utils/validators";
import SimpleButton from "../UI/SimpleButton";
import WarningPopup from "../Popups/WarningPopup";
import { popupActions } from "../../store/popup-slice";
import LoaderSpinner from "../UI/LoaderSpinner";
import ModalHeaderPortal from "./ModalHeaderPortal";

const stagedDataReducer = (state, action) => {
  return action.type === "setAll"
    ? action.values
    : { ...state, [`${action.id}`]: action.value };
};

const defaultReducer = {
  location: "",
  first_name: "",
  last_name: "",
  tagline: "",
  profile_picture: placeholderPhoto,
  "create-email": "",
  "create-password": "",
  crop: { x: 0, y: 0 },
  zoom: 1,
};

const CreateAccountModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-account" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const [stagedData, dispatchStageData] = useReducer(
    stagedDataReducer,
    defaultReducer
  );

  const [buttonText, setButtonText] = useState("+ Create");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [allowCrop, setAllowCrop] = useState(false);

  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const [validationPosition, setValidationPosition] = useState(false);

  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [prevUsername, setPrevUsername] = useState(false);
  const [resentEmail, setResentEmail] = useState(false);
  const [resendButtonText, setResendButtonText] = useState(
    "Resend Verification Email"
  );
  
  const buttonTextOnSubmit = (
    <div style={{ display: "flex" }}>
      Creating &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
    </div>
  );
  const validatorBubbleID = "validator-bubble";
  const dispatch = useDispatch();

  // Data has been changed if stagedData values differ from defaultValues
  const dataChanged = !stagedData
    ? false
    : Object.keys(stagedData)?.find(
        (key) => stagedData[key] !== defaultReducer[key]
      );

  const onPhotoChange = (newImage) => {
    newImage !== placeholderPhoto ? setAllowCrop(true) : setAllowCrop(false);
  };

  const runValidation = () => {
    return runValidators(
      createProfileValidators(placeholderPhoto),
      stagedData,
      setValidationMessage,
      setValidationDisplay,
      setValidationID,
      setValidationPosition,
      validatorBubbleID
    );
  };

  const resetForm = (err) => {
    if (err) {
      // User already created error
      if (err.status === 406) {
        dispatch(popupActions.showPopup("user-already-exists"));
      }

      setButtonText("+ Create");
    } else {
      setShowConfirmEmail(true);
    }
  };

  const onSubmit = (data) => {
    setPrevUsername(stagedData["create-email"]);
    createAccount(
      {
        ...data,
        username: stagedData["create-email"].toLowerCase(),
        password: stagedData["create-password"],
      },
      resetForm
    );
  };

  const handleResendEmail = () => {
    if (prevUsername) {
      const onComplete = (response) => {
        if (response.ok) {
          setResendButtonText("Email Sent!");
        } else {
          setResentEmail(false);
          setResendButtonText("Resend Confirmation Email");
        }
      };

      setResendButtonText("Sending Email..");
      setResentEmail(true);
      resendVerificationEmail(prevUsername, onComplete);
    }
  };

  return (
    <ModalPortal>
      <WarningPopup
        selector={"user-already-exists"}
        header={`Account for ${stagedData["create-email"]} already exists.`}
        message={"Please try again with a different email."}
        ok={"OK"}
        okClick={() => dispatch(popupActions.hidePopup())}
      />
      <div className={styles.container} style={modalStyle}>
        <ModalHeaderPortal selector={"create-account"}>
          Create Account
        </ModalHeaderPortal>
        <ValidatorBubble
          id={validatorBubbleID}
          elementID={validationID}
          display={validationDisplay}
          message={validationMessage}
          setDisplay={setValidationDisplay}
          position={validationPosition}
        />
        {showConfirmEmail ? (
          <div className={styles.confirmEmailContainer}>
            <h2 className={styles.confirmEmailHeader}>Check your email!</h2>
            <div className={styles.confirmEmailText}>
              {`We've sent a link to ${stagedData["create-email"]}
              that you can use to finish creating your account.`}
            </div>
            <SimpleButton
              className={`${styles.resendEmailButton} ${
                resentEmail ? styles.unclickable : null
              }`}
              onClick={resentEmail ? null : handleResendEmail}
            >
              {resendButtonText}
            </SimpleButton>
            
          </div>
        ) : (
          <ProfileEditor
            stagedData={stagedData}
            dispatchStageData={dispatchStageData}
            buttonText={buttonText}
            setButtonText={setButtonText}
            buttonTextOnSubmit={buttonTextOnSubmit}
            buttonSelector={"create-account"}
            editingPhoto={editingPhoto}
            setEditingPhoto={setEditingPhoto}
            onSubmit={onSubmit}
            onPhotoChange={onPhotoChange}
            allowCrop={allowCrop}
            defaultValues={defaultReducer}
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
              defaultVal={defaultReducer["create-email"]}
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
              defaultVal={defaultReducer["create-password"]}
              className={styles.simpleInput}
              setDataChanged={(value) => {
                dispatchStageData({ id: "create-password", value });
              }}
            />
          </ProfileEditor>
        )}
      </div>
    </ModalPortal>
  );
};

export default CreateAccountModal;
