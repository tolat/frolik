import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useRef, useState } from "react";
import ImageCropper from "../Tools/ImageCropper";
import { arrayBufferToBase64 } from "../../utils/utils";
import { dataActions } from "../../store/data-slice";
import CroppedImage from "../UI/CroppedImage";
import { hideModal } from "../../store/modal-actions";
import { uploadProfilePicture } from "../../utils/data-fetch";
import CustomSelect from "../UI/CustomSelect";
import balloonIcon from "../../images/balloon1.png";

const EditProfileModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const dataState = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [editing, setEditing] = useState(false);
  const master = dataState.masterPhotoDimension;
  const photoDimentionStyle = { width: `${master}rem`, height: `${master}rem` };
  const userData = dataState.users[user._id];
  const stagedData = userData.staged;
  const stagedPhoto = stagedData.profile_picture || userData.profile_picture;
  const stagedCrop = stagedData.crop || userData.crop;
  const stagedZoom = stagedData.zoom || userData.zoom;
  const [preStageCrop, setPreStageCrop] = useState(stagedCrop);
  const [preStageZoom, setPreStageZoom] = useState(stagedZoom);
  const globals = useSelector(state => state.auth.globals)
  const statusMap = globals.statusMap;

  const formRefs = {
    first_name: useRef(),
    last_name: useRef(),
    tagline: useRef(),
    status: useRef(),
    location: useRef(),
  };

  const handleShowCropper = () => {
    dispatch(
      dataActions.stageUserProfilePicture({
        userID: user._id,
        photoString: stagedPhoto,
      })
    );
    setEditing(true);
  };

  const handleHideCropper = () => {
    setEditing(false);
    dispatch(
      dataActions.stageUserCrop({ userID: user._id, crop: preStageCrop })
    );
    dispatch(
      dataActions.stageUserZoom({ userID: user._id, zoom: preStageZoom })
    );
  };

  const handleUploadClick = () => {
    document.getElementById("imgupload").click();
  };

  const updateProfilePicture = async () => {
    const newPhoto = document.getElementById("imgupload").files[0];
    if (newPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          dataActions.stageUserProfilePicture({
            userID: user._id,
            photoString: arrayBufferToBase64(reader.result),
          })
        );
      };

      reader.readAsArrayBuffer(newPhoto);
    }
  };

  const handleRevert = () => {
    dispatch(dataActions.clearStagedPhotoData({ userID: user._id }));
    setEditing(false);
  };

  const handleSave = () => {
    dispatch(dataActions.commitStagedPhotoData({ userID: user._id }));
    uploadProfilePicture(user._id);
    hideModal();
  };

  const statusOptions = Object.keys(statusMap).map((key) => {
    const selectable = key === "Ready" || key === "Busy";
    return {
      selectable,
      name: key,
      component: (
        <StatusOption
          unselectable={!selectable}
          name={key}
          details={statusMap[key]}
        />
      ),
    };
  });

  const locationOptions = Object.keys(statusMap).map((key) => {
    const selectable = key === "Ready" || key === "Busy";
    return {
      selectable,
      name: key,
      component: (
        <StatusOption
          unselectable={!selectable}
          name={key}
          details={statusMap[key]}
        />
      ),
    };
  });

  return (
    <ModalPortal>
      <div
        id="edit-profile-modal"
        style={modalStyle}
        className={`${styles.container} noscroll`}
      >
        <div className={styles.photoEditor}>
          <input
            onChange={updateProfilePicture}
            type="file"
            id="imgupload"
            style={{ display: "none" }}
          />
          {editing ? (
            <ImageCropper
              image={stagedPhoto}
              zoom={stagedZoom}
              crop={stagedCrop}
              containerStyle={{
                ...photoDimentionStyle,
                marginBottom: "2rem",
                borderRadius: "100rem",
              }}
              setPreStageCrop={setPreStageCrop}
              setPreStageZoom={setPreStageZoom}
            />
          ) : !stagedPhoto ? null : (
            <CroppedImage
              image={stagedPhoto}
              zoom={stagedZoom}
              crop={stagedCrop}
              style={photoDimentionStyle}
              className={styles.userPhoto}
            />
          )}
          <div className={styles.sideBySide}>
            {editing ? (
              <SimpleButton
                onClick={handleHideCropper}
                className={styles.cropButton}
              >
                Done Cropping
              </SimpleButton>
            ) : (
              <SimpleButton
                onClick={handleShowCropper}
                className={styles.cropButton}
              >
                Crop Photo
              </SimpleButton>
            )}
          </div>

          <div className={styles.sideBySide}>
            <SimpleButton
              onClick={handleUploadClick}
              className={styles.uploadButton}
            >
              Upload New Picture
            </SimpleButton>
            {stagedPhoto === userData.profile_picture ? null : (
              <SimpleButton
                onClick={handleRevert}
                className={styles.revertButton}
              >
                Revert
              </SimpleButton>
            )}
          </div>
        </div>
        <CustomSelect
          options={statusOptions}
          name={"Status"}
          label={"Status:"}
          ref={formRefs.status}
          defaultVal={user.status.status}
          className={styles.statusSelect}
        />
        <CustomSelect
          options={locationOptions}
          name={"Location"}
          label={"Location:"}
          ref={formRefs.location}
          defaultVal={user.location}
          className={styles.statusSelect}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name:"
            ref={formRefs.first_name}
            defaultVal={user.first_name}
          />
          <div className={styles.formSpacer} />
          <SimpleInput
            type="text"
            id="last_name"
            name="last_name"
            label="Last Name:"
            ref={formRefs.last_name}
            defaultVal={user.last_name}
          />
        </div>
        <SimpleInput
          type="text"
          id="tagline"
          name="tagline"
          label="Tagline:"
          ref={formRefs.tagline}
          defaultVal={user.tagline}
        />
        <SimpleButton onClick={handleSave} className={styles.saveButton}>
          Save
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
        <img
          style={{ height: "2rem" }}
          src={balloonIcon}
          alt={"balloonIcon"}
        />{" "}
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
