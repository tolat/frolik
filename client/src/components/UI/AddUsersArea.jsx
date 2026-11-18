import { Fragment } from "react";
import styles from "./styles/AddUsersArea.module.scss";
import UserIconCluster from "./UserIconCluster";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/plus.png";
import { useT } from "../../i18n";

const AddUsersArea = (props) => {
  const { t } = useT();
  return (
    <Fragment>
      <div className={styles.usersContainer}>
        <button onClick={props.onEditClick} className={styles.roundButton}>
          <img
            className={props.editButtonClassName}
            src={editIcon}
            alt={t("ui.addUsers.edit")}
          />
        </button>
        <UserIconCluster
          users={props.users}
          sizeInRem={20}
          borderSizeInRem={1.5}
          pieShadow={true}
        />
        <button onClick={props.onAddClick} className={styles.roundButton}>
          <img className={styles.editIcon} src={plusIcon} alt={t("ui.addUsers.add")} />
        </button>
      </div>
    </Fragment>
  );
};

export default AddUsersArea;
