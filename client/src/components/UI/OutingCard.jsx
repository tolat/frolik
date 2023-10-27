import { useSelector } from "react-redux";
import styles from "./styles/OutingCard.module.scss";
import UserIconCluster from "./UserIconCluster";

const OutingCard = (props) => {
  const categoryColorMap = useSelector(state=>state.auth.globals.categoryColorMap)
  const o = props.outing;

  return (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[o.activity?.category] }}
        className={styles.categoryStripe}
      ></div>
      <div className={styles.innerContainer}>
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.name}>{o.activity?.name}</div>
            <div className={styles.status}>
              {`${o.status} - ${new Date(o.date_completed).toDateString()}`}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
            <UserIconCluster backerClassName={styles.iconBacker} users={o.users} sizeInRem={7} borderSizeInRem={0.5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutingCard;
