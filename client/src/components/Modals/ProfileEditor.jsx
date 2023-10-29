import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import styles from "./styles/ProfileEditor.module.scss";
import ModalPortal from "./ModalPortal";
import ImageCropper from "../UI/ImageCropper";
import { arrayBufferToBase64 } from "../../utils/utils";
import CroppedImage from "../UI/CroppedImage";
import CustomAutocomplete from "../UI/CustomAutocomplete";
import { useEffect, useState } from "react";
import { fetchGobals } from "../../utils/data-fetch";

const ProfileEditor = (props) => {
  const dataState = useSelector((state) => state.data);
  const master = dataState.masterPhotoDimension;
  const photoDimentionStyle = { width: `${master}rem`, height: `${master}rem` };
  const [globals, setGlobals] = useState(false);

  const stagedData = props.stagedData;
  const dispatchStageData = props.dispatchStageData;
  const buttonText = props.buttonText;
  const setButtonText = props.setButtonText;
  const buttonTextOnSubmit = props.buttonTextOnSubmit;
  const stagedCrop = stagedData.crop || props.defaultCrop;
  const stagedZoom = stagedData.zoom || props.defaultZoom;
  const stagedImage = stagedData.image || props.defaultImage;
  const defaultImage = props.defaultImage;
  const editingPhoto = props.editingPhoto;
  const setEditingPhoto = props.setEditingPhoto;
  const formRefs = props.formRefs;
  const allowCrop = props.allowCrop;

  // Get globals from server
  useEffect(() => {
    fetchGobals(setGlobals);
  }, []);

  // Data has been changed if stagedData has any non-false values
  const dataChanged = Object.keys(stagedData)
    .map((k) => stagedData[k])
    .find((val) => !!val);

  // Set editing photo state to true
  const handleShowCropper = () => {
    setEditingPhoto(true);
  };

  // Actions to do on cropper close differs from create account to edit profile
  const handleHideCropper = () => {
    setEditingPhoto(false);
  };

  const handleUploadClick = () => {
    document.getElementById("profile-editor-img-upload").click();
  };

  const updateProfilePicture = async () => {
    const newPhoto = document.getElementById("profile-editor-img-upload")
      .files[0];
    if (newPhoto) {
      // Read file into a base64String and update the staged image
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = arrayBufferToBase64(reader.result);
        dispatchStageData({
          type: "image",
          value: base64Image,
        });
        props.onPhotoChange && props.onPhotoChange(base64Image);
      };

      reader.readAsArrayBuffer(newPhoto);
    }
  };

  const handleRevert = () => {
    dispatchStageData({ type: "image", value: false });
    handleHideCropper();
    setEditingPhoto(false);
  };

  const handleSave = () => {
    // Hide cropper if it is open
    handleHideCropper();

    // Set button text to submitting value
    setButtonText(buttonTextOnSubmit);

    const data = {
      location: formRefs.location.current.value,
      first_name: formRefs.first_name.current.value,
      last_name: formRefs.last_name.current.value,
      tagline: formRefs.tagline.current.value,
      image: stagedImage,
      crop: stagedCrop,
      zoom: stagedZoom,
    };

    // Use submit function from parent
    props.onSubmit(data);
  };

  return (
    <ModalPortal>
      <div className={`${styles.container} noscroll`}>
        <div className={styles.photoEditor}>
          <input
            onChange={updateProfilePicture}
            type="file"
            id="profile-editor-img-upload"
            style={{ display: "none" }}
          />
          {editingPhoto ? (
            <ImageCropper
              image={stagedImage || defaultImage}
              zoom={stagedZoom}
              crop={stagedCrop}
              containerStyle={{
                ...photoDimentionStyle,
                marginBottom: "2rem",
                borderRadius: "100rem",
              }}
              setCropChange={(value) =>
                dispatchStageData({ type: "crop", value })
              }
              setZoomChange={(value) =>
                dispatchStageData({ type: "zoom", value })
              }
            />
          ) : (
            <CroppedImage
              image={stagedImage || defaultImage}
              zoom={stagedZoom}
              crop={stagedCrop}
              style={photoDimentionStyle}
              className={styles.userPhoto}
            />
          )}
          <div className={styles.sideBySide}>
            {editingPhoto ? (
              <SimpleButton
                onClick={handleHideCropper}
                className={styles.cropButton}
              >
                Done Cropping
              </SimpleButton>
            ) : !allowCrop ? null : (
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
            {stagedImage && stagedImage !== defaultImage ? (
              <SimpleButton
                onClick={handleRevert}
                className={styles.revertButton}
              >
                Revert
              </SimpleButton>
            ) : null}
          </div>
        </div>
        {props.children}
        <CustomAutocomplete
          options={globals.cityData}
          name={"Location"}
          label={"Location:"}
          ref={formRefs.location}
          className={styles.locationSelect}
          defaultVal={props.defaultValues.location}
          setDataChanged={(value) => {
            dispatchStageData({ type: "location", value });
          }}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name:"
            ref={formRefs.first_name}
            defaultVal={props.defaultValues.first_name}
            setDataChanged={(value) => {
              dispatchStageData({ type: "first_name", value });
            }}
          />
          <div className={styles.formSpacer} />
          <SimpleInput
            type="text"
            id="last_name"
            name="last_name"
            label="Last Name:"
            ref={formRefs.last_name}
            defaultVal={props.defaultValues.last_name}
            setDataChanged={(value) => {
              dispatchStageData({ type: "last_name", value });
            }}
          />
        </div>
        <SimpleInput
          type="text"
          id="tagline"
          name="tagline"
          label="Tagline:"
          ref={formRefs.tagline}
          defaultVal={props.defaultValues.tagline}
          setDataChanged={(value) => {
            dispatchStageData({ type: "tagline", value });
          }}
        />
        <SimpleButton
          onClick={dataChanged ? handleSave : null}
          className={dataChanged ? styles.saveButton : styles.unclickableButton}
        >
          {buttonText}
        </SimpleButton>
      </div>
    </ModalPortal>
  );
};

export default ProfileEditor;
