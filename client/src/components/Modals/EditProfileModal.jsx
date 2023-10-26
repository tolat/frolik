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

const EditProfileModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const dataState = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const [editing, setEditing] = useState(false);
  const userData = dataState.users[user._id];
  const stagedPhoto =
    userData.staged.profile_picture || userData.profile_picture;
  const photoDimentionStyle = { width: `25rem`, height: `25rem` };
  const stagedCrop = userData.staged.crop || user.profile_picture.crop;
  const stagedZoom = userData.staged.zoom || user.profile_picture.zoom;
  const [preStageCrop, setPreStageCrop] = useState(stagedCrop);
  const [preStageZoom, setPreStageZoom] = useState(stagedZoom);

  const formRefs = {
    first_name: useRef(),
    last_name: useRef(),
    tagline: useRef(),
  };

  const handleShowCropper = () => {
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
    hideModal();
  };

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
          ) : (
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
        <div className={styles.nameEditor}>
          <SimpleInput
            type="text"
            id="first_name"
            name="first_name"
            label="First Name:"
            defaultVal={user.first_name}
          />
          <div className={styles.formSpacer} />
          <SimpleInput
            type="text"
            id="last_name"
            name="last_name"
            label="Last Name:"
            defaultVal={user.last_name}
          />
        </div>
        <SimpleInput
          type="text"
          id="tagline"
          name="tagline"
          label="Tagline:"
          defaultVal={user.tagline}
        />
        <SimpleButton onClick={handleSave} className={styles.saveButton}>
          Save
        </SimpleButton>
      </div>
    </ModalPortal>
  );
};

export default EditProfileModal;
