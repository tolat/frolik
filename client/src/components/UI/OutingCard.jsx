import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { modalActions } from "../../store/modal-slice";
import { outingIsCompleted } from "../../utils/utils";

const OutingCard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = useSelector(
    (state) => state.auth.globals.categoryColorMap
  );
  const o = props.outing;
  const completed = o && outingIsCompleted(o);
  const status = completed ? "Completed" : "Pending";
  const dispatch = useDispatch();
  const userFlaked = o.flakes.find((id) => id === user._id);

  const handleClick = () => {
    dispatch(modalActions.setActiveOuting(o));
    dispatch(modalActions.setSelector("outing-modal"));
    dispatch(modalActions.showModal());
  };

  return !categoryColorMap ? null : (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[o.activity?.category] }}
        className={styles.categoryStripe}
      ></div>
      <div
        onClick={handleClick}
        className={
          userFlaked ? styles.flakedInnerContainer : styles.innerContainer
        }
      >
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.nameActivityContainer}>
              <div className={styles.activity}>{o.activity?.name}</div>
              <div className={styles.name}>{o.name}</div>
            </div>

            <div className={styles.status}>
              {`${status} - ${new Date(
                completed ? o.date_completed : o.date_created
              ).toDateString()}`}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
            <UserIconCluster
              users={o.users}
              sizeInRem={7}
              borderSizeInRem={0.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutingCard;
