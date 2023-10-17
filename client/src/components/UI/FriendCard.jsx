import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import { Fragment, useEffect, useState } from "react";

import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { fetchUserFriendData } from "../../utils/user-fetch";
import IconButton from "./IconButton";

import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/air-balloon.png";

const FriendCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const [friendUser, setFriendUser] = useState(false);
  const buttonIconStyle = { width: "3rem", height: "3rem" };

  // Get friend user from server
  useEffect(() => {
    fetchUserFriendData(props.userID, setFriendUser);
  }, [setFriendUser, props.userID]);

  return !friendUser ? (
    <div className={styles.friendLoading}>Loading...</div>
  ) : (
    <div
      onClick={props.onClick}
      style={props.style}
      className={styles.container}
    >
      <div className={styles.leftContainer}>
        <div className={styles.iconContainer}>
          <UserIcon sizeInRem="6" borderSizeInRem="0.8" user={friendUser} />
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.userName}>
            {`${friendUser.first_name} ${friendUser.last_name}`}
          </div>
          <div className={styles.ratingsContainer}>
            <StatIcon
              alt="flake"
              icon={flakeIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={friendUser.flake}
            />
            <StatIcon
              alt="outings"
              icon={outingsIcon}
              style={statContainerStyle}
              iconStyle={statIconStyle}
              rating={friendUser.outings.length}
            />
          </div>
        </div>
      </div>
      {props.buttonSet === "add" ? (
        <div className={styles.addButton}>+</div>
      ) : props.buttonSet === "none" ? null : props.buttonSet === "remove" ? (
        <div onClick={props.onRemove} className={styles.addButton}>
          -
        </div>
      ) : (
        <div className={styles.rightContainer}>
          <IconButton
            className={styles.button}
            iconStyle={buttonIconStyle}
            icon={chatIcon}
          />
          <IconButton
            className={styles.button}
            iconStyle={buttonIconStyle}
            icon={getOutIcon}
          />
        </div>
      )}
    </div>
  );
};

export default FriendCard;
