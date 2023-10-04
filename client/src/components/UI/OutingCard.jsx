import SimpleButton from "./SimpleButton";
import styles from "./styles/OutingCard.module.scss";
import { categoryColorMap } from "../../utils/client-dev-db";
import UserIcon from "./UserIcon";

const OutingCard = (props) => {
  const o = props.outing;
  return (
    <div style={props.style} className={styles.outerContainer}>
      <div
        style={{ backgroundColor: categoryColorMap[o.activity.category] }}
        className={styles.categoryStripe}
      ></div>
      <div className={styles.innerContainer}>
        <div className={styles.upperSection}>
          <div className={styles.leftUpperSection}>
            <div className={styles.name}>{o.activity.name}</div>
            <div className={styles.status}>
              {`${o.status} - ${o.date_completed.toLocaleString().slice(0, 8)}`}
            </div>
          </div>
          <div className={styles.rightUpperSection}>
          </div>
        </div>
        <SimpleButton
          style={{
            color: "rgb(111, 111, 111)",
            backgroundColor: "rgb(223, 223, 223)",
            borderBottomRightRadius: "5px",
          }}
        >
          View Media
        </SimpleButton>
      </div>
    </div>
  );
};

export default OutingCard;
