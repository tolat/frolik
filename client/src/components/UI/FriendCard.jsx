import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import { useEffect, useState } from "react";

import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { fetchUserFriendData } from "../../utils/user-fetch";

const FriendCard = (props) => {
  const iconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const [friendUser, setFriendUser] = useState(false);

  // Get friend user from server
  useEffect(() => {
    fetchUserFriendData(props.user, setFriendUser);
  }, [setFriendUser, props.user]);

  return !friendUser ? (
    <div className={styles.friendLoading}>Loading...</div>
  ) : (
    <div style={props.style} className={styles.container}>
      <div className={styles.iconContainer}>
        <UserIcon
          sizeInRem="6"
          borderSizeInRem="0.5"
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
            iconStyle={iconStyle}
            rating={friendUser.flake}
          />
          <StatIcon
            alt="outings"
            icon={outingsIcon}
            style={statContainerStyle}
            iconStyle={iconStyle}
            rating={friendUser.outings.length}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
