import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import UserIcon from "../UI/UserIcon";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";

const EditProfileModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <div className={styles.photoEditor}>
          <UserIcon
            sizeInRem={18}
            user={user}
            profilePic={user.profile_picture}
            borderSizeInRem={"0"}
          />
          <SimpleButton className={styles.uploadButton}>
            Upload New Picture
          </SimpleButton>
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
        <SimpleButton className={styles.saveButton}>Save</SimpleButton>
      </div>
    </ModalPortal>
  );
};

export default EditProfileModal;
