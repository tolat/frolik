import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import styles from "./styles/ProfileEditor.module.scss";
import ModalPortal from "./ModalPortal";
import ImageCropper from "../UI/ImageCropper";
import { arrayBufferToBase64 } from "../../utils/utils";
import CroppedImage from "../UI/CroppedImage";
import CustomAutocomplete from "../UI/CustomAutocomplete";

const ProfileEditor = (props) => {
  const dataState = useSelector((state) => state.data);
  const master = dataState.masterPhotoDimension;
  const photoDimentionStyle = { width: `${master}rem`, height: `${master}rem` };
  const globals = useSelector(state=> state.auth.globals)

  const defaultValues = props.defaultValues;
  const stagedData = props.stagedData;
  const dispatchStageData = props.dispatchStageData;
  const buttonText = props.buttonText;
  const setButtonText = props.setButtonText;
  const buttonTextOnSubmit = props.buttonTextOnSubmit;
  const editingPhoto = props.editingPhoto;
  const setEditingPhoto = props.setEditingPhoto;
  const allowCrop = props.allowCrop;
  const dataChanged = props.dataChanged;

  // Set editing photo state to true
  const handleShowCropper = (e) => {
    e.preventDefault();
    setEditingPhoto(true);
  };

  // Actions to do on cropper close differs from create account to edit profile
  const handleHideCropper = (e) => {
    e.preventDefault();
    setEditingPhoto(false);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
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
          id: "profile_picture",
          value: base64Image,
        });
        props.onPhotoChange && props.onPhotoChange(base64Image);
      };

      reader.readAsArrayBuffer(newPhoto);
    }
  };

  const handleRevert = (e) => {
    e.preventDefault();

    // Reset fiel input file list
    function createFileList(files) {
      const dataTransfer = new DataTransfer();
      for (const file of files) {
        dataTransfer.items.add(file);
      }
      return dataTransfer.files;
    }
    document.getElementById("profile-editor-img-upload").files = createFileList(
      []
    );

    dispatchStageData({
      id: "profile_picture",
      value: defaultValues.profile_picture,
    });
    dispatchStageData({
      id: "crop",
      value: defaultValues.crop,
    });
    dispatchStageData({
      id: "zoom",
      value: defaultValues.zoom,
    });
    handleHideCropper(e);
    setEditingPhoto(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Run validation before proceeding, return if validation fails
    if (props.runValidation && !props.runValidation()) {
      return;
    }

    // Hide cropper if it is open
    handleHideCropper(e);

    // Set button text to submitting value
    setButtonText(buttonTextOnSubmit);

    const data = {
      location: stagedData.location,
      first_name: stagedData.first_name,
      last_name: stagedData.last_name,
      tagline: stagedData.tagline,
      profile_picture: stagedData.profile_picture,
      crop: stagedData.crop,
      zoom: stagedData.zoom,
    };

    // Use submit function from parent
    props.onSubmit(data);
  };

  const onSubmitBlur = () => {
    props.clearValidators && props.clearValidators();
  };

  return (
    <ModalPortal>
      <form className={`${styles.container} noscroll`}>
        <div className={styles.photoEditor}>
          <input
            onChange={updateProfilePicture}
            type="file"
            id="profile-editor-img-upload"
            style={{ display: "none" }}
          />
          {editingPhoto ? (
            <ImageCropper
              image={stagedData.profile_picture}
              zoom={stagedData.zoom}
              crop={stagedData.crop}
              containerStyle={{
                ...photoDimentionStyle,
                marginBottom: "2rem",
                borderRadius: "100rem",
              }}
              setCropChanged={(value) =>
                dispatchStageData({ id: "crop", value })
              }
              setZoomChanged={(value) =>
                dispatchStageData({ id: "zoom", value })
              }
            />
          ) : (
            <CroppedImage
              id={"profile_picture"}
              image={stagedData.profile_picture}
              zoom={stagedData.zoom}
              crop={stagedData.crop}
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
            {stagedData.profile_picture &&
            stagedData.profile_picture !== defaultValues.profile_picture ? (
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
          options={globals?.cityData}
          name={"Location"}
          label={"Location:"}
          id={"location"}
          className={styles.locationSelect}
          defaultVal={defaultValues.location}
          setDataChanged={(value) => {
            dispatchStageData({ id: "location", value });
          }}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name:"
            defaultVal={defaultValues.first_name}
            setDataChanged={(value) => {
              dispatchStageData({ id: "first_name", value });
            }}
          />
          <div className={styles.formSpacer} />
          <SimpleInput
            type="text"
            id="last_name"
            name="last_name"
            label="Last Name:"
            defaultVal={defaultValues.last_name}
            setDataChanged={(value) => {
              dispatchStageData({ id: "last_name", value });
            }}
          />
        </div>
        <SimpleInput
          type="text"
          id="tagline"
          name="tagline"
          label="Tagline:"
          defaultVal={defaultValues.tagline}
          setDataChanged={(value) => {
            dispatchStageData({ id: "tagline", value });
          }}
        />
        <SimpleButton
          onClick={dataChanged ? handleSave : (e) => e.preventDefault()}
          onBlur={onSubmitBlur}
          className={dataChanged ? styles.saveButton : styles.unclickableButton}
        >
          {buttonText}
        </SimpleButton>
      </form>
    </ModalPortal>
  );
};

export default ProfileEditor;
