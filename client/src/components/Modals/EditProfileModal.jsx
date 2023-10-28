import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useReducer, useRef, useState } from "react";
import ImageCropper from "../Tools/ImageCropper";
import { arrayBufferToBase64 } from "../../utils/utils";
import { dataActions } from "../../store/data-slice";
import CroppedImage from "../UI/CroppedImage";
import { uploadProfileData } from "../../utils/data-fetch";
import CustomSelect from "../UI/CustomSelect";
import balloonIcon from "../../images/balloon1.png";
import CustomAutocomplete from "../UI/CustomAutocomplete";

const dataChangedReducer = (state, action) => {
  if (action.type === "reset") {
    return {};
  } else {
    return { ...state, [`${action.type}`]: action.value };
  }
};

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
  const stagedData = userData?.staged;
  const stagedPhoto = stagedData?.profile_picture || userData?.profile_picture;
  const stagedCrop = stagedData?.crop || userData?.crop;
  const stagedZoom = stagedData?.zoom || userData?.zoom;
  const [preStageCrop, setPreStageCrop] = useState(stagedCrop);
  const [preStageZoom, setPreStageZoom] = useState(stagedZoom);
  const globals = useSelector((state) => state.auth.globals);
  const statusMap = globals?.statusMap;
  const cities = globals?.cityData;
  const [saveButtonText, setSaveButtonText] = useState("Save");
  const [dataChangedState, dispatchDataChanged] = useReducer(
    dataChangedReducer,
    {}
  );

  // Data has been changed if dataChangedState has any true field values
  const dataChanged = Object.keys(dataChangedState)
    .map((k) => dataChangedState[k])
    .filter((val) => val)[0];

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

  const stagePreStagedCrop = () => {
    dispatch(
      dataActions.stageUserCrop({ userID: user._id, crop: preStageCrop })
    );
    dispatch(
      dataActions.stageUserZoom({ userID: user._id, zoom: preStageZoom })
    );
  };

  const handleHideCropper = () => {
    // Set data changed to true if crop/zoom have been updated
    if (
      (preStageCrop.x && preStageCrop.x !== user.profile_picture?.crop.x) ||
      (preStageCrop.y && preStageCrop.y !== user.profile_picture?.crop.y) ||
      (preStageZoom >= 1 && preStageZoom !== user.profile_picture?.zoom)
    ) {
      dispatchDataChanged({ type: "crop", value: true });
    } else {
      dispatchDataChanged({ type: "crop", value: false });
    }

    setEditing(false);
    stagePreStagedCrop();
  };

  const handleUploadClick = () => {
    document.getElementById("imgupload").click();
  };

  const updateProfilePicture = async () => {
    const newPhoto = document.getElementById("imgupload").files[0];
    if (newPhoto) {
      dispatchDataChanged({ type: "image", value: true });
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
    dispatchDataChanged({ type: "image", value: false });
    setEditing(false);
  };

  const resetData = () => {
    dispatchDataChanged({ type: "reset" });
    setSaveButtonText("Save");
  };

  const handleSave = () => {
    // Hide cropper if it is open
    handleHideCropper();

    // Stage prestaged image data if image has been edited
    if (dataChangedState.crop) {
      stagePreStagedCrop();
    }

    setSaveButtonText("Saving..");
    dispatch(dataActions.commitStagedPhotoData({ userID: user._id }));
    const data = {
      status: formRefs.status.current.innerHTML,
      location: formRefs.location.current.value,
      first_name: formRefs.first_name.current.value,
      last_name: formRefs.last_name.current.value,
      tagline: formRefs.tagline.current.value,
    };
    uploadProfileData(user._id, data, resetData);
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
            {stagedPhoto === userData?.profile_picture ? null : (
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
          defaultVal={user?.status?.status}
          className={styles.statusSelect}
          setDataChanged={(value) => {
            dispatchDataChanged({ type: "status", value });
          }}
        />
        <CustomAutocomplete
          options={cities}
          name={"Location"}
          label={"Location:"}
          ref={formRefs.location}
          defaultVal={user.location}
          className={styles.locationSelect}
          setDataChanged={(value) => {
            dispatchDataChanged({ type: "location", value });
          }}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name:"
            ref={formRefs.first_name}
            defaultVal={user.first_name}
            setDataChanged={(value) => {
              dispatchDataChanged({ type: "first_name", value });
            }}
          />
          <div className={styles.formSpacer} />
          <SimpleInput
            type="text"
            id="last_name"
            name="last_name"
            label="Last Name:"
            ref={formRefs.last_name}
            defaultVal={user.last_name}
            setDataChanged={(value) => {
              dispatchDataChanged({ type: "last_name", value });
            }}
          />
        </div>
        <SimpleInput
          type="text"
          id="tagline"
          name="tagline"
          label="Tagline:"
          ref={formRefs.tagline}
          defaultVal={user.tagline}
          setDataChanged={(value) => {
            dispatchDataChanged({ type: "tagline", value });
          }}
        />
        <SimpleButton
          onClick={dataChanged ? handleSave : null}
          className={dataChanged ? styles.saveButton : styles.unclickableButton}
        >
          {saveButtonText}
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
