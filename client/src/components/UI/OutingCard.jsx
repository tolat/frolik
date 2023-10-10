import styles from "./styles/OutingCard.module.scss";
import { categoryColorMap } from "../../utils/globals";
import UserIcon from "./UserIcon";

const OutingCard = (props) => {
  const o = props.outing;

  return (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[o.activity.category] }}
        className={styles.categoryStripe}
      ></div>
      <div className={styles.innerContainer}>
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.name}>{o.activity.name}</div>
            <div className={styles.status}>
              {`${o.status} - ${new Date(o.date_completed).toDateString()}`}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
            {/* TEMPORARY - CHANGE BELOW LOGIC TO PULL profilePic FROM USER (S3)*/}
            {o.users.map((u) =>
              u.username !== props.user.username ? (
                <div key={Math.random()} className={styles.userIconContainer}>
                  <UserIcon
                    sizeInRem="5"
                    borderSizeInRem="0.6"
                    user={u}
                    profilePic={u.profile_picture}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutingCard;
