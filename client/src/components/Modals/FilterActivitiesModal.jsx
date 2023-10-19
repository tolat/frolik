import { useSelector } from "react-redux";
import styles from "./styles/FilterActivitiesModal.module.scss";
import ModalPortal from "./ModalPortal";
import SimpleSelect from "../UI/SimpleSelect";
import SimpleInput from "../UI/SimpleInput";
import SimpleButton from "../UI/SimpleButton";
import { useRef } from "react";
import { hideModal } from "../../store/modal-actions";
import { initialActivityFilter } from "../../utils/globals";
import SimpleCheckbox from "../UI/SimpleCheckbox";

const categories = ["Any", "Games", "Food", "Sports", "Art", "Adventure"];

const FilterActivitiesModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "filter-activities" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };


  const updateLocalFilter = () => {
    const filter = {};
    for (let key in filterRefs) {
      if (["newOnly", "featuredOnly", "completedOnly"].includes(key)) {
        filter[key] = filterRefs[key].current.checked;
      } else {
        filter[key] = filterRefs[key].current.value;
      }
    }
    return filter;
  };

  const filterRefs = {
    category: useRef(),
    maxParticipants: useRef(),
    minParticipants: useRef(),
    minRating: useRef(),
    maxCost: useRef(),
    minCost: useRef(),
    maxTime: useRef(),
    newOnly: useRef(),
    completedOnly: useRef(),
    featuredOnly: useRef(),
  };

  // Apply filter changes
  function handleApplyFilter() {
    props.dispatchFilter({
      type: "apply-filter",
      active: true,
      filter: updateLocalFilter(),
    });

    hideModal();
  }

  // Apply filter changes
  function handleClearFilter() {
    props.dispatchFilter({
      type: "apply-filter",
      active: true,
      filter: initialActivityFilter.filter,
    });

    hideModal();
  }

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <SimpleButton
          onClick={handleApplyFilter}
          className={styles.applyButton}
        >
          Apply
        </SimpleButton>
        <SimpleButton
          onClick={handleClearFilter}
          className={styles.clearButton}
        >
          Clear Filters
        </SimpleButton>

        <SimpleSelect
          options={categories}
          name={"Category"}
          label={"Filter By Category:"}
          ref={filterRefs.category}
          defaultVal={props.filter.category}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            name={"max-participants"}
            label={"Maximum Participants:"}
            type="number"
            min={0}
            ref={filterRefs.maxParticipants}
            defaultVal={props.filter.maxParticipants}
          />
          <div className={styles.spacer}></div>
          <SimpleInput
            name={"min-participants"}
            label={"Minimum Participants:"}
            type="number"
            min={0}
            ref={filterRefs.minParticipants}
            defaultVal={props.filter.minParticipants}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={5}
          type={"number"}
          name={"min-rating"}
          label={"Minimum Rating:"}
          ref={filterRefs.minRating}
          defaultVal={props.filter.minRating}
        />
        <div className={styles.sideBySide}>
          <SimpleInput
            min={0}
            type={"number"}
            name={"max-cost"}
            label={"Maximum Cost:"}
            ref={filterRefs.maxCost}
            defaultVal={props.filter.maxCost}
          />
          <div className={styles.spacer} />
          <SimpleInput
            min={0}
            type={"number"}
            name={"min-cost"}
            label={"Minimum Cost:"}
            ref={filterRefs.minCost}
            defaultVal={props.filter.minCost}
          />
        </div>
        <div className={styles.spacer} />
        <SimpleInput
          min={0}
          max={24}
          type={"number"}
          name={"max-time"}
          label={"Maximum Time:"}
          ref={filterRefs.maxTime}
          defaultVal={props.filter.maxTime}
        />
        <SimpleCheckbox
          label={"Completed Only"}
          name={"completedOnly"}
          ref={filterRefs.completedOnly}
          defaultVal={props.filter.completedOnly}
        />
        <SimpleCheckbox
          label={"New Only"}
          name={"newOnly"}
          ref={filterRefs.newOnly}
          defaultVal={props.filter.newOnly}
        />
        <SimpleCheckbox
          label={"Featured Only"}
          name={"featuredOnly"}
          ref={filterRefs.featuredOnly}
          defaultVal={props.filter.featuredOnly}
        />
      </div>
    </ModalPortal>
  );
};

export default FilterActivitiesModal;