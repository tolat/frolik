import styles from "./styles/ProfileHeader.module.scss";
import UserIcon from "./UserIcon";
import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import StatIcon from "./StatIcon";
import locationIcon from "../../images/location-dark.png";

const ProfileHeader = (props) => {
  const iconStyle = { width: "4rem", height: "4rem" };
  const userStatus = props.user?.status?.status;

  let statusClassName = null;
  switch (userStatus) {
    case "Ready":
      statusClassName = styles.statusReady;
      break;
    case "Searching":
      statusClassName = styles.statusSearching;
      break;
    case "Busy":
      statusClassName = styles.statusBusy;
      break;
    case "Inactive":
      statusClassName = styles.statusInactive;
      break;
    default:
      statusClassName = null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profilePicContainer}>
        <StatIcon
          alt="flake"
          icon={flakeIcon}
          iconStyle={iconStyle}
          rating={props.user.flake}
        />
        <UserIcon
          sizeInRem={20}
          user={props.user}
          borderSizeInRem={"1.5"}
          pieShadow={true}
        />
        <StatIcon
          alt="outings"
          icon={outingsIcon}
          iconStyle={iconStyle}
          rating={props.user.outings?.length}
        />
      </div>
      <div
        className={styles.userName}
      >{`${props.user.first_name} ${props.user.last_name}`}</div>
      <div className={styles.tagline}>{props.user.tagline}</div>
      <div className={styles.sideBySide}>
        <div className={`${styles.statusContainer} ${statusClassName}`}>
          Status: {userStatus}
        </div>
        <div className={styles.locationContainer}>
          <img
            style={{ marginRight: "10px" }}
            className={styles.smallIcon}
            src={locationIcon}
            alt="location-icon"
          />
          {props.user.location}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;