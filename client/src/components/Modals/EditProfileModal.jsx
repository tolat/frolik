import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import SimpleInput from "../UI/SimpleInput";
import UserIcon from "../UI/UserIcon";
import styles from "./styles/EditProfileModal.module.scss";

const EditProfileModal = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={styles.container}>
      <div className={styles.photoEditor}>
        <UserIcon
          sizeInRem={22}
          user={user}
          profilePic={user.profile_picture}
          borderSizeInRem={"0"}
        />
        <SimpleButton className={styles.uploadButton}>Upload New Picture</SimpleButton>
      </div>
      <div className={styles.nameEditor}>
        <SimpleInput
          type="text"
          id="first_name"
          name="first_name"
          label="First Name:"
          value={user.first_name}
        />
        <div className={styles.formSpacer} />
        <SimpleInput
          type="text"
          id="last_name"
          name="last_name"
          label="Last Name:"
          value={user.last_name}
        />
      </div>
      <SimpleInput
        type="text"
        id="tagline"
        name="tagline"
        label="Tagline:"
        value={user.tagline}
      />
      <SimpleButton className={styles.saveButton}>Save</SimpleButton>
    </div>
  );
};

export default EditProfileModal;
