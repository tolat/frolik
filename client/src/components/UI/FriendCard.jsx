import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-slice";

const FriendCard = memo(function FriendCard(props) {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const sizeInRem = props.small ? "5" : "6";
  const borderSizeInRem = props.small ? "0.5" : "0.8";
  const nameStyle = { fontSize: props.small ? "1.8rem" : null };
  const dispatch = useDispatch();
  const detailsContainerStyle = props.small
    ? {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }
    : null;

  const showProfileViewerModal = () => {
    dispatch(modalActions.setActiveModalUser(props.user));
    dispatch(modalActions.setSelector("profile-viewer-modal"));
    dispatch(modalActions.showModal());
  };

  return (
    <div
      style={{ ...props.style, boxShadow: props.noShadow ? "none" : null }}
      className={styles.container}
    >
      <div className={styles.leftContainer} onClick={showProfileViewerModal}>
        <div className={styles.iconContainer}>
          <UserIcon
            backer={true}
            sizeInRem={sizeInRem}
            borderSizeInRem={borderSizeInRem}
            user={props.user}
          />
        </div>

        <div className={styles.detailsContainer} style={detailsContainerStyle}>
          <div className={styles.userName} style={nameStyle}>
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
