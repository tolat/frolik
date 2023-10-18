import { useSelector } from "react-redux";
import styles from "./styles/FilterActivitiesModal.module.scss";
import ModalPortal from "./ModalPortal";
import SimpleSelect from "../UI/SimpleSelect";
import SimpleInput from "../UI/SimpleInput";
import SimpleButton from "../UI/SimpleButton";
import { useEffect, useRef } from "react";
import { hideModal } from "../../store/modal-actions";

const categories = ["Any", "Games", "Food", "Sports", "Art", "Adventure"];

const FilterActivitiesModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "filter-activities" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const updateLocalFilter = () => {
    const extractValuesFromRefsFilter = {};
    for (let key in filter) {
      extractValuesFromRefsFilter[key] = filter[key].current.value;
    }
    return extractValuesFromRefsFilter;
  };

  const filter = {
    category: useRef(),
    maxParticipants: useRef(),
    minParticipants: useRef(),
    minRating: useRef(props.filter.minRating),
    maxCost: useRef(props.filter.maxCost),
    minCost: useRef(props.filter.minCost),
    maxTime: useRef(props.filter.maxTime),
    //newOnly: useRef(props.filter.newOnly),
    //completedOnly: useRef(props.filter.completedOnly),
    //featuredOnly: useRef(props.filter.featuredOnly),
  };

  // Apply filter changes
  const handleApplyFilter = () => {
    props.dispatchFilter({
      type: "apply-filter",
      active: true,
      filter: updateLocalFilter(),
    });

    hideModal();
  };


  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <SimpleButton
          onClick={handleApplyFilter}
          className={styles.applyButton}
        >
          Apply
        </SimpleButton>
        <SimpleSelect
          options={categories}
          name={"Category"}
          label={"Filter By Category:"}
          ref={filter.category}
          defaultValue={props.filter.category}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            name={"max-participants"}
            label={"Maximum Participants:"}
            type="number"
            min={0}
            ref={filter.maxParticipants}
            defaultValue={props.filter.maxParticipants}
          />
          <div className={styles.spacer}></div>
          <SimpleInput
            name={"min-participants"}
            label={"Minimum Participants:"}
            type="number"
            min={0}
            ref={filter.minParticipants}
            defaultValue={props.filter.minParticipants}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={5}
          type={"number"}
          name={"min-rating"}
          label={"Minimum Rating:"}
          ref={filter.minRating}
          defaultValue={props.filter.minRating}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            min={0}
            type={"number"}
            name={"max-cost"}
            label={"Maximum Cost:"}
            ref={filter.maxCost}
          defaultValue={props.filter.maxCost}
          />
          <div className={styles.spacer} />
          <SimpleInput
            min={0}
            type={"number"}
            name={"min-cost"}
            label={"Minimum Cost:"}
            ref={filter.minCost}
          defaultValue={props.filter.minCost}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={24}
          type={"number"}
          name={"max-time"}
          label={"Maximum Time:"}
          ref={filter.maxTime}
          defaultValue={props.filter.maxTime}
        />
      </div>
    </ModalPortal>
  );
};

export default FilterActivitiesModal;
