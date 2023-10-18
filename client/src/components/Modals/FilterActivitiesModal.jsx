import { useSelector } from "react-redux";
import styles from "./styles/FilterActivitiesModal.module.scss";
import ModalPortal from "./ModalPortal";
import SimpleSelect from "../UI/SimpleSelect";
import SimpleInput from "../UI/SimpleInput";
import SimpleButton from "../UI/SimpleButton";

const categories = ["Any", "Games", "Food", "Sports", "Art", "Adventure"];

const FilterActivitiesModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "filter-activities" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <SimpleButton className={styles.applyButton}>Apply</SimpleButton>
        <SimpleSelect
          options={categories}
          name={"Category"}
          label={"Filter By Category:"}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            name={"max-participants"}
            label={"Maximum Participants:"}
          />
          <div className={styles.spacer}></div>
          <SimpleInput
            name={"min-participants"}
            label={"Minimum Participants:"}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={5}
          type={"number"}
          name={"min-rating"}
          label={"Minimum Rating:"}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            min={0}
            type={"number"}
            name={"max-cost"}
            label={"Maximum Cost:"}
          />
          <div className={styles.spacer} />
          <SimpleInput
            min={0}
            type={"number"}
            name={"min-cost"}
            label={"Minimum Cost:"}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={24}
          type={"number"}
          name={"max-time"}
          label={"Maximum Time:"}
        />
      </div>
    </ModalPortal>
  );
};

export default FilterActivitiesModal;
