import SimpleButton from "./SimpleButton";
import styles from "./styles/OutingCard.module.scss";
import { categoryColorMap } from "../../utils/globals";
import UserIcon from "./UserIcon";

import { seedProfilePicMap } from "../../utils/globals";

const OutingCard = (props) => {
  const o = props.outing;
  const buttonStyle = {
    color: "rgb(111, 111, 111)",
    backgroundColor: "rgb(223, 223, 223)",
    borderBottomRightRadius: "5px",
  };

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
                    sizeInRem="6"
                    borderSizeInRem="0.8"
                    user={u}
                    profilePic={u.profile_picture}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
        {/* <SimpleButton style={buttonStyle}>View Media</SimpleButton> */}
      </div>
    </div>
  );
};

export default OutingCard;
