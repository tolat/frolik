import styles from "./styles/Go.module.scss";
import { useDispatch, useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import { Fragment, useEffect, useState } from "react";
import AddUserModal from "../Modals/AddUserModal";
import { modalActions } from "../../store/modal-slice";
import editIcon from "../../images/edit.png";
import plusIcon from "../../images/plus.png";
import EditUsersModal from "../Modals/EditUsersModal";
import UserIconCluster from "../UI/UserIconCluster";
import buttonStyles from "../../components/UI/styles/SimpleButton.module.scss";
import { fetchActivities } from "../../utils/data-fetch";
import ActivityCard from "../UI/ActivityCard";

const Go = (props) => {
  const dispatch = useDispatch();
  const [activities, setActivities] = useState([]);
  const users = useSelector(state=> state.go.outing.users)

  // Handle Add user button click
  const handleAddUserClick = () => {
    dispatch(modalActions.setSelector("add-user"));
    dispatch(modalActions.showModal());
  };

  // Handle Edit users button click
  const handleEditUsersClick = () => {
    dispatch(modalActions.setSelector("edit-users"));
    dispatch(modalActions.showModal());
  };

  // Get all activities
  useEffect(() => {
    fetchActivities(setActivities);
  }, [setActivities]);

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
          <UserIconCluster users={users} sizeInRem={16} borderSizeInRem={1.5} />
          <button onClick={handleAddUserClick} className={styles.roundButton}>
            <img className={styles.editIcon} src={plusIcon} alt="add-people" />
          </button>
        </div>
        <SimpleButton className={styles.goButton}>+ Create Outing</SimpleButton>
        <SimpleButton className={buttonStyles.greyButton}>
          Filter Activities
        </SimpleButton>

        {activities.map(a=> <ActivityCard key={Math.random()} activity={a}/>)}
      </div>
    </Fragment>
  );
};

export default Go;

export const goLoader = async () => {
  return null;
};
