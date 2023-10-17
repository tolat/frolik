import styles from "./styles/Go.module.scss";
import { fetchAuth } from "../../store/auth-actions";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import store from "../../store";
import SimpleButton from "../UI/SimpleButton";
import { Fragment } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import { hideModalFast } from "../../store/modal-actions";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/plus.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import buttonStyles from "../../components/UI/styles/SimpleButton.module.scss"

const Go = (props) => {
  const dispatch = useDispatch();

  // Handle Add Participant
  const handleAddUserClick = () => {
    dispatch(modalActions.setSelector("add-user"));
    dispatch(modalActions.showModal());
  };

  const handleEditUsersClick = () => {
    dispatch(modalActions.setSelector("edit-users"));
    dispatch(modalActions.showModal());
  };

  const user = useSelector((state) => state.auth.user);
  return (
    <Fragment>
      <AddUserModal />
      <EditUsersModal />
      <div className={styles.container}>
        <div className={styles.usersContainer}>
          <button onClick={handleEditUsersClick} className={styles.roundButton}>
            <img
              className={styles.editIcon}
              src={editIcon}
              alt="edit-friends"
            />
          </button>
          <UserIconCluster sizeInRem={14} />
          <button onClick={handleAddUserClick} className={styles.roundButton}>
            <img className={styles.editIcon} src={plusIcon} alt="add-people" />
          </button>
        </div>
        <SimpleButton className={styles.goButton}>+ Create Outing</SimpleButton>
        <SimpleButton className={buttonStyles.greyButton}>
          Filter Activities
        </SimpleButton>
      </div>
    </Fragment>
  );
};

export default Go;

export const goLoader = async () => {
  await fetchAuth()();
  hideModalFast();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  }
  return null;
};
