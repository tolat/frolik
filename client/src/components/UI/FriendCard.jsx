import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import { useEffect, useState } from "react";

import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { fetchUserFriendData } from "../../utils/user-fetch";
import IconButton from "./IconButton";

import chatIcon from "../../images/chat.png";
import getOutIcon from "../../images/get-out.png"

const FriendCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const [friendUser, setFriendUser] = useState(false);
  const buttonIconStyle = { width: "3rem", height: "3rem"};

  // Get friend user from server
  useEffect(() => {
    fetchUserFriendData(props.user, setFriendUser);
  }, [setFriendUser, props.user]);

  return !friendUser ? (
    <div className={styles.friendLoading}>Loading...</div>
  ) : (
    <div style={props.style} className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.iconContainer}>
          <UserIcon
            sizeInRem="6"
            borderSizeInRem="0.8"
            user={friendUser}
            profilePic={props.user.profile_picture}
          />
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
    </div>
  );
};

export default FriendCard;
