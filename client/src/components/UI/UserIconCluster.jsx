import { useSelector } from "react-redux";
import styles from "./styles/UserIconCluster.module.scss";
import UserIcon from "./UserIcon";

const UserIconCluster = (props) => {
  const user = useSelector((state) => state.auth.user);
  const goOuting = useSelector((state) => state.go.outing);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <UserIcon
          sizeInRem={props.sizeInRem}
          user={user}
          borderSizeInRem={"1.5"}
        />
      </div>
    </div>
  );
};

export default UserIconCluster;
