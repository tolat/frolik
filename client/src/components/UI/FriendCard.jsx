import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { memo } from "react";

const FriendCard = memo(function FriendCard(props) {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };

  return (
    <div
      onClick={props.onClick}
      style={props.style}
      className={styles.container}
    >
      <div className={styles.leftContainer}>
        <div className={styles.iconContainer}>
          <UserIcon
            backer={true}
            sizeInRem="6"
            borderSizeInRem="0.7"
            user={props.user}
          />
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.userName}>
            {`${props.user.first_name} ${props.user.last_name}`}
          </div>
          <div className={styles.ratingsContainer}>
            <StatIcon
              alt="flake"
              icon={flakeIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={props.user.flake}
            />
            <StatIcon
              alt="outings"
              icon={outingsIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={props.user.outings?.length}
            />
          </div>
        </div>
      </div>
      {props.buttons}
    </div>
  );
}, propsAreEqual);

function propsAreEqual(oldProps, newProps) {
  console.log(oldProps, newProps);

  return true;
}
export default FriendCard;
