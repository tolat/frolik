import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useEffect, useReducer, useState } from "react";
import { dataActions } from "../../store/data-slice";
import { uploadProfileData } from "../../utils/data-fetch";
import CustomSelect from "../UI/CustomSelect";
import balloonIcon from "../../images/air-balloon.png";
import ProfileEditor from "./ProfileEditor";
import { hideModal } from "../../store/modal-actions";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { editProfileValidators } from "../../utils/validators";
import LoaderSpinner from "../UI/LoaderSpinner";
import ModalHeaderPortal from "./ModalHeaderPortal";
import SimpleButton from "../UI/SimpleButton";
import { fetchLogout } from "../../store/auth-actions";
import logoutIcon from "../../images/logout.png";
import { modalActions } from "../../store/modal-slice";

const stagedDataReducer = (state, action) => {
  return action.type === "setAll"
    ? action.values
    : { ...state, [`${action.id}`]: action.value };
};

const EditProfileModal = () => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const dataState = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const userData = dataState.users[user._id];
  const validatorBubbleID = "validator-bubble";
  const [buttonText, setButtonText] = useState("Save");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const [validationPosition, setValidationPosition] = useState(false);
  const globals = useSelector((state) => state.auth.globals);
  const [stagedData, dispatchStageData] = useReducer(stagedDataReducer);
  const [defaultValues, setDefaultValues] = useState({});
  const buttonTextOnSubmit = (
    <div style={{ display: "flex" }}>
      Saving &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
    </div>
  );

  // Initialize defaultValues as daata is loaded from server
  useEffect(() => {
    setDefaultValues({
      location: user.location,
      first_name: user.first_name,
      last_name: user.last_name,
      tagline: user.tagline,
      status: user.status?.status,
      profile_picture: userData.profile_picture,
      crop: userData.crop,
      zoom: userData.zoom,
    });
  }, [user, userData]);

  // Initialize the staged data reducer state with the default values
  useEffect(() => {
    dispatchStageData({ type: "setAll", values: defaultValues });
  }, [defaultValues]);

  // Data has been changed if stagedData values differ from defaultValues
  const dataChanged = !stagedData
    ? false
    : Object.keys(stagedData)?.find((key) => {
        return key === "crop"
          ? stagedData[key].x !== defaultValues[key].x ||
              stagedData[key].y !== defaultValues[key].y
          : stagedData[key] !== defaultValues[key];
      });

  const statusOptions =
    globals &&
    Object.keys(globals.statusMap).map((key) => {
      const selectable = key === "Ready" || key === "Busy";
      return {
        selectable,
        name: key,
        component: (
          <StatusOption
            unselectable={!selectable}
            name={key}
            details={globals?.statusMap[key]}
          />
        ),
      };
    });

  const runValidation = () => {
    return runValidators(
      editProfileValidators(globals),
      stagedData,
      setValidationMessage,
      setValidationDisplay,
      setValidationID,
      setValidationPosition,
      validatorBubbleID
    );
  };

  const resetForm = () => {
    hideModal();
    setButtonText("Save");
  };

  const onSubmit = (data) => {
    dispatch(dataActions.updateUserPhotoData({ userID: user._id, data }));
    const fullData = { ...data, status: stagedData.status };
    uploadProfileData(user._id, fullData, resetForm);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await hideModal();
    fetchLogout();
  };

  const handleInstall = async () => {
    await hideModal(true);
    dispatch(modalActions.setSelector("install-prompt"));
    dispatch(modalActions.showModal());
  };

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <ModalHeaderPortal selector={"edit-profile"}>
          Edit Profile
        </ModalHeaderPortal>
        <ValidatorBubble
          id={validatorBubbleID}
          elementID={validationID}
          display={validationDisplay}
          message={validationMessage}
          position={validationPosition}
          setDisplay={setValidationDisplay}
        />
        <ProfileEditor
          stagedData={stagedData}
          dispatchStageData={dispatchStageData}
          buttonText={buttonText}
          setButtonText={setButtonText}
          buttonTextOnSubmit={buttonTextOnSubmit}
          buttonSelector={"edit-profile"}
          editingPhoto={editingPhoto}
          setEditingPhoto={setEditingPhoto}
          onSubmit={onSubmit}
          allowCrop={true}
          defaultValues={defaultValues}
          dataChanged={dataChanged}
          runValidation={runValidation}
          clearValidators={() => setValidationDisplay("none")}
          resetForm={resetForm}
        >
          <CustomSelect
            options={statusOptions}
            name={"Status"}
            id={"status"}
            label={"Status:"}
            defaultVal={defaultValues.status}
            className={styles.statusSelect}
            setDataChanged={(value) => {
              dispatchStageData({ id: "status", value });
            }}
          />
        </ProfileEditor>
        <SimpleButton
          onClick={handleInstall}
          text={"Install Frolik App"}
          className={styles.installButton}
        >
          Install Frolik App
        </SimpleButton>
        <SimpleButton
          onClick={handleLogout}
          text={"Logout"}
          icon={logoutIcon}
          className={styles.logoutButton}
        >
          Logout
        </SimpleButton>
      </div>
    </ModalPortal>
  );
};

const StatusOption = (props) => {
  const details =
    props.name !== "Searching" ? (
      props.details
    ) : (
      <div>
        Your status is set to Searching when you are on the{" "}
        <img style={{ height: "2rem" }} src={balloonIcon} alt={"balloonIcon"} />{" "}
        page.
      </div>
    );
  return (
    <div
      className={`${styles.statusOptionContainer} ${
        props.unselectable ? styles.unselectable : null
      }`}
    >
      <div className={styles.statusName}>{props.name}</div>
      <div className={styles.statusDetails}>{details}</div>
    </div>
  );
};

export default EditProfileModal;
