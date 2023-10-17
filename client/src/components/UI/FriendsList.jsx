import FriendCard from "./FriendCard";
import styles from "./styles/FriendsList.module.scss";

const FriendsList = (props) => {
  return (
    <div className={styles.container}>
      {props.friendIDs.map((id) => (
        <FriendCard
          key={Math.random()}
          userID={id}
        />
      ))}
    </div>
  );
};

export default FriendsList;
