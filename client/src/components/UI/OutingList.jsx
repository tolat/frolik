import OutingCard from "./OutingCard";
import styles from "./styles/OutingList.module.scss";

const OutingList = (props) => {
  return (
    <div className={styles.container}>
      {props.user.outings.map((o) => (
        <div key={Math.random()} className={styles.outingContainer}>
          <OutingCard outing={o} user={props.user} />
        </div>
      ))}
    </div>
  );
};

export default OutingList;
