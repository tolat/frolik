import StatIcon from "./StatIcon";
import styles from "./styles/FriendCard.module.scss";
import UserIcon from "./UserIcon";
import flakeIcon from "../../images/snowflake.png";
import outingsIcon from "../../images/outing2.png";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import { hideModal } from "../../store/modal-actions";
import { calculateFlakeRating } from "../../utils/utils";

const FriendCard = (props) => {
  const statIconStyle = { width: "2rem", height: "2rem" };
  const statContainerStyle = { marginLeft: "1rem" };
  const sizeInRem = props.small ? "5" : "6";
  const borderSizeInRem = props.small ? "0.5" : "0.8";
  const nameStyle = { fontSize: props.small ? "1.8rem" : null };
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const flakeRating = props.user && calculateFlakeRating(props.user)
  const detailsContainerStyle = props.small
    ? {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }
    : null;

  const showProfileViewerModal = async () => {
    if (modalState.selector !== "none") {
      await hideModal(true);
    }
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
              rating={flakeRating}
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
};

export default FriendCard;
