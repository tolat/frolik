import { popupActions } from "../../store/popup-slice";
import LanguagePicker from "../UI/LanguagePicker";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useEffect, useReducer, useState } from "react";
import { dataActions } from "../../store/data-slice";
import { uploadProfileData } from "../../utils/data-fetch";
import StatusButtons from "../UI/StatusButtons";
import AutoLocationToggle from "../UI/AutoLocationToggle";
import ProfileEditor from "./ProfileEditor";
import { hideModal } from "../../store/modal-actions";
import ValidatorBubble, { runValidators } from "../UI/ValidatorBubble";
import { editProfileValidators } from "../../utils/validators";
import BrandLoader from "../UI/BrandLoader";
import ModalHeaderPortal from "./ModalHeaderPortal";
import SimpleButton from "../UI/SimpleButton";
import { fetchLogout } from "../../store/auth-actions";
import logoutIcon from "../../images/logout.png";
import { modalActions } from "../../store/modal-slice";
import { startTour } from "../Tour/Tour";
import { confirmLocation, geoFromPoint } from "../../utils/location";
import NotificationsToggle from "../UI/NotificationsToggle";
import DarkModeToggle from "../UI/DarkModeToggle";
import WarningPopup from "../Popups/WarningPopup";
import { deleteAccount } from "../../utils/data-fetch";
import { useT } from "../../i18n";

const stagedDataReducer = (state, action) => {
  return action.type === "setAll"
    ? action.values
    : { ...state, [`${action.id}`]: action.value };
};

const EditProfileModal = () => {
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const dataState = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const userData = dataState.users[user._id];
  const validatorBubbleID = "validator-bubble";
  // null = the idle "Save" label (translated at render time)
  const [buttonText, setButtonText] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState("none");
  const [validationID, setValidationID] = useState(false);
  const [validationPosition, setValidationPosition] = useState(false);
  const globals = useSelector((state) => state.auth.globals);
  const [stagedData, dispatchStageData] = useReducer(stagedDataReducer);
  const [defaultValues, setDefaultValues] = useState({});
  // Saving: the app's ring spinner (no balloon), white on the blue Save pill
  const buttonTextOnSubmit = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
      <BrandLoader inline plain light noBalloon size={1.4} />
      {t("settings.saving")}
    </span>
  );

  // Initialize defaultValues as daata is loaded from server
  useEffect(() => {
    // Saving without changing the city is valid (keeps its coordinates)
    confirmLocation(user.location, geoFromPoint(user.location_geo));
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

  // Saved: close the panel with the usual Back transition (the profile
  // underneath already shows the new details)
  const resetForm = () => {
    hideModal();
    setButtonText(null);
  };

  const onSubmit = (data) => {
    dispatch(dataActions.updateUserPhotoData({ userID: user._id, data }));
    const fullData = { ...data, status: stagedData.status };
    // On failure the server's warning popup shows; the button comes back
    uploadProfileData(user._id, fullData, resetForm, () =>
      setButtonText(null)
    );
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await hideModal();
    fetchLogout();
  };

  // Delete profile: confirm in a drawer, then delete and go to the login
  // screen (a full reload, so nothing of the old account stays in memory)
  const [deleting, setDeleting] = useState(false);
  const askDeleteProfile = () => dispatch(popupActions.showPopup("confirm-delete-profile"));
  const handleDeleteProfile = () => {
    if (deleting) return;
    setDeleting(true);
    deleteAccount(
      user._id,
      () => {
        try {
          sessionStorage.removeItem("returnTo");
        } catch {}
        window.location = "/login";
      },
      () => setDeleting(false)
    );
  };

  // Opens the "Get the Frolik app" drawer over settings
  const handleInstall = () => {
    dispatch(popupActions.showPopup("install-prompt"));
  };

  // check if the device is in standalone mode
  const isInStandaloneMode = () => {
    return "standalone" in window.navigator && window.navigator.standalone;
  };
  const inStandaloneMode = isInStandaloneMode();

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <ModalHeaderPortal selector={"edit-profile"}>
          {t("settings.header")}
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
          buttonText={buttonText || t("settings.save")}
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
          locationLocked={!!user.auto_location}
          locationExtra={
            <>
              <AutoLocationToggle />
              <NotificationsToggle />
              <DarkModeToggle />
            </>
          }
          clearValidators={() => setValidationDisplay("none")}
          resetForm={resetForm}
          placeholderLabels={true}
          beforeLocation={
            <LanguagePicker save={true} selector="language-picker-settings" />
          }
        >
          <StatusButtons
            id={"status"}
            defaultVal={defaultValues.status}
            setDataChanged={(value) => {
              dispatchStageData({ id: "status", value });
            }}
          />
        </ProfileEditor>
        <SimpleButton
          onClick={async () => {
            await hideModal();
            startTour();
          }}
          className={styles.tourButton}
        >
          {t("settings.takeTour")}
        </SimpleButton>
        <SimpleButton
          style={{ display: inStandaloneMode ? "none" : null }}
          onClick={handleInstall}
          text={t("settings.installApp")}
          className={styles.installButton}
        >
          {t("settings.installApp")}
        </SimpleButton>
        <SimpleButton
          onClick={handleLogout}
          text={t("settings.logout")}
          icon={logoutIcon}
          className={styles.logoutButton}
        >
          {t("settings.logout")}
        </SimpleButton>
        <button
          type="button"
          className={styles.deleteProfileLink}
          onClick={askDeleteProfile}
        >
          {t("settings.deleteProfile.link")}
        </button>
        <WarningPopup
          selector="confirm-delete-profile"
          header={t("settings.deleteProfile.header")}
          message={t("settings.deleteProfile.message")}
          delete={
            deleting
              ? t("settings.deleteProfile.deleting")
              : t("settings.deleteProfile.confirm")
          }
          deleteClick={handleDeleteProfile}
          cancel={t("settings.deleteProfile.cancel")}
          cancelClick={() => dispatch(popupActions.hidePopup())}
        />
      </div>
    </ModalPortal>
  );
};


export default EditProfileModal;
