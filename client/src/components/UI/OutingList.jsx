import OutingCard from "./OutingCard";
import styles from "./styles/OutingList.module.scss";

const OutingList = (props) => {
  const completed = props.user.outings.filter((o) => o.status === "Completed");
  const pending = props.user.outings.filter((o) => o.status === "Pending");

  return (
    <div className={styles.container}>
      {pending[0] && (
        <div className={styles.pendingContainer}>
          <h2>Pending Outings</h2>
          <div className={styles.headingBlurb}>
            <b>You can have up to 5 pending outings at a time.</b>
            <br />
            <br/>
          </div>
          {pending.map((o) => (
            <div key={Math.random()} className={styles.outingContainer}>
              <OutingCard
                setModalOuting={props.setModalOuting}
                outing={o}
                user={props.user}
              />
            </div>
          ))}
        </div>
      )}
      {completed[0] &&
        completed.map((o) => (
          <div key={Math.random()} className={styles.outingContainer}>
            <OutingCard
              setModalOuting={props.setModalOuting}
              outing={o}
              user={props.user}
            />
          </div>
        ))}
    </div>
  );
};

export default OutingList;
