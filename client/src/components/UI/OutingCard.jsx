import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingCard.module.scss";
import UserIconCluster from "./UserIconCluster";
import { modalActions } from "../../store/modal-slice";

const OutingCard = (props) => {
  const categoryColorMap = useSelector(
    (state) => state.auth.globals.categoryColorMap
  );
  const o = props.outing;
  const dispatch = useDispatch();

  const handleClick = () => {
    props.setModalOuting(o);
    dispatch(modalActions.setSelector("outing"));
    dispatch(modalActions.showModal());
  };

  return !categoryColorMap ? null : (
    <div style={props.style} className={styles.outerContainer}>
      
      <div
        style={{ backgroundColor: categoryColorMap[o.activity?.category] }}
        className={styles.categoryStripe}
      ></div>
      <div onClick={handleClick} className={styles.innerContainer}>
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.nameActivityContainer}>
              <div className={styles.activity}>{o.activity?.name}</div>
              <div className={styles.name}>{o.name}</div>
            </div>

            <div className={styles.status}>
              {`${o.status} - ${new Date(
                o.status === "Completed" ? o.date_completed : o.date_created
              ).toDateString()}`}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
            <UserIconCluster
              backerClassName={styles.iconBacker}
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
