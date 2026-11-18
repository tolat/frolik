import { resetViewportShift } from "../../utils/pageScroll";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import styles from "./styles/ProfileEditor.module.scss";
import { genBackgroundStr } from "../../utils/utils";
import { fileToResizedDataURL } from "../../utils/imageResize";
import CroppedImage from "../UI/CroppedImage";
import LocationAutocomplete from "../UI/LocationAutocomplete";
import CropperPopup from "../Popups/CropperPopup";
import { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popupActions } from "../../store/popup-slice";
import uploadIcon from "../../images/upload-light.png";
import ModalButtonPortal from "./ModalButtonPortal";
import { useT } from "../../i18n";

const ProfileEditor = (props) => {
  const { t } = useT();
  const dimension = 20;
  const photoDimentionStyle = {
    width: `${dimension}rem`,
    height: `${dimension}rem`,
  };
  const defaultValues = props.defaultValues;
  const stagedData = props.stagedData;
  const dispatchStageData = props.dispatchStageData;
  const buttonText = props.buttonText;
  const setButtonText = props.setButtonText;
  const buttonTextOnSubmit = props.buttonTextOnSubmit;
  const dataChanged = props.dataChanged;
  const dispatch = useDispatch();
  const [upload, setUpload] = useState(null);
  const uploadInputRef = useRef(null);
  const globals = useSelector((state) => state.auth.globals);
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = globals?.categoryColorMap;
  const backgroundString = genBackgroundStr(user, categoryColorMap);
  const photoChanged =
    stagedData?.profile_picture &&
    stagedData?.profile_picture !== defaultValues?.profile_picture;

  const pieStyle = {
    minWidth: `${dimension + 1.5}rem`,
    height: `${dimension + 1.5}rem`,
    background: backgroundString,
    margin: "0 2rem",
  };

  useEffect(() => {
    setUpload(stagedData.profile_picture);
  }, [stagedData]);

  const resetUploadFileList = () => {
    // Reset fiel input file list
    function createFileList(files) {
      const dataTransfer = new DataTransfer();
      for (const file of files) {
        dataTransfer.items.add(file);
      }
      return dataTransfer.files;
    }
    document.getElementById("upload-profile-photo").files = createFileList([]);
  };

  const handleRevert = (e) => {
    e?.preventDefault();

    // Reset file input file list
    resetUploadFileList();

    dispatchStageData({ type: "setAll", values: defaultValues });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Run validation before proceeding, return if validation fails
    if (props.runValidation && !props.runValidation()) {
      return;
    }

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

  const onUploadClick = (e) => {
    e.preventDefault();
    uploadInputRef.current?.click();
  };

  const onPhotoSelected = async () => {
    // Back from the iOS photo picker: undo its viewport shift
    resetViewportShift();
    const newPhoto = document.getElementById("upload-profile-photo").files[0];

    if (newPhoto) {
      // Shrink it in the browser first (a byte-by-byte base64 copy of a
      // full-res phone photo used to freeze the screen for seconds)
      let base64Image;
      try {
        base64Image = await fileToResizedDataURL(newPhoto, 1600);
      } catch {
        resetUploadFileList();
        return;
      }

      // Set upload for popup use
      setUpload(base64Image);

      // Run onchange funciton from props if there is one
      props.onPhotoChange && props.onPhotoChange(base64Image);

      // Show the zoom & crop drawer
      dispatch(popupActions.showPopup("upload-profile-photo"));
    }
  };

  const handleCropComplete = (index, croppedImage, resetCropper) => {
    // Update staged data with new photo
    dispatchStageData({
      id: "profile_picture",
      value: croppedImage,
    });
    dispatchStageData({
      id: "crop",
      value: { x: 0, y: 0 },
    });
    dispatchStageData({
      id: "zoom",
      value: 1,
    });

    dispatch(popupActions.hidePopup());
    resetUploadFileList();
    resetCropper(index);
    resetViewportShift();
  };

  const handleCropCancel = (index, resetCropper) => {
    dispatch(popupActions.hidePopup());
    resetUploadFileList();
    resetCropper(index);
    resetViewportShift();
  };

  // Settings shows each field's name as its placeholder instead of a title
  // above it (placeholderLabels); sign-up keeps the titles
  const fieldText = (text) =>
    props.placeholderLabels ? { placeholder: text } : { label: text };

  return (
    <Fragment>
      <CropperPopup
        images={[upload]}
        selector={"upload-profile-photo"}
        onCancel={handleCropCancel}
        onUpload={handleCropComplete}
        button1Text={t("popups.cropper.done")}
        button1ActionText={t("popups.cropper.done")}
        defaultCrop={stagedData.crop}
        defaultZoom={stagedData.zoom}
        cropShape="round"
      />
      <form id="upload-profile-photo-form">
        <input
          ref={uploadInputRef}
          onChange={onPhotoSelected}
          type="file"
          id="upload-profile-photo"
          style={{ display: "none" }}
        />
      </form>
      <form className={`${styles.container} noscroll`}>
        <div className={styles.photoEditor}>
          <input
            onChange={onPhotoSelected}
            type="file"
            id="profile-editor-img-upload"
            style={{ display: "none" }}
          />
          <div className={styles.photoContainer}>
            <div style={pieStyle} className={styles.pieChart}>
              <CroppedImage
                id={"profile_picture"}
                image={stagedData.profile_picture}
                zoom={stagedData.zoom}
                crop={stagedData.crop}
                style={photoDimentionStyle}
                className={styles.userPhoto}
                badgeStyle={{ display: "flex" }}
                badge={
                  <img
                    src={uploadIcon}
                    className={styles.editButton}
                    alt={t("profileEdit.photo.editAlt")}
                  />
                }
                onBadgeClick={onUploadClick}
              />
            </div>
          </div>
        </div>
        {/* Settings: every row in one column with one even gap (the rows'
            own margins differed, so some touched and others didn't) */}
        <div className={props.placeholderLabels ? styles.fieldStack : styles.fieldPlain}>
        {props.children}
        {props.beforeLocation}
        <LocationAutocomplete
          name={"Location"}
          {...fieldText(t("profileEdit.fields.city"))}
          id={"location"}
          className={styles.locationSelect}
          defaultVal={defaultValues.location}
          locked={props.locationLocked}
          setDataChanged={(value) => {
            dispatchStageData({ id: "location", value });
          }}
        />
        {props.locationExtra}
        <div className={styles.sideBySide}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            {...fieldText(t("profileEdit.fields.firstName"))}
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
            {...fieldText(t("profileEdit.fields.lastName"))}
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
          {...fieldText(t("profileEdit.fields.tagline"))}
          defaultVal={defaultValues.tagline}
          setDataChanged={(value) => {
            dispatchStageData({ id: "tagline", value });
          }}
        />
        </div>
        <SimpleButton
          onClick={photoChanged ? handleRevert : (e) => e.preventDefault()}
          className={`${styles.revertButton} ${
            photoChanged ? null : styles.noClick
          }`}
        >
          {t("profileEdit.buttons.revertPhoto")}
        </SimpleButton>
        <ModalButtonPortal selector={props.buttonSelector}>
          <SimpleButton
            onClick={dataChanged ? handleSave : (e) => e.preventDefault()}
            className={
              dataChanged ? styles.saveButton : styles.unclickableButton
            }
          >
            {buttonText}
          </SimpleButton>
        </ModalButtonPortal>
      </form>
    </Fragment>
  );
};

export default ProfileEditor;
