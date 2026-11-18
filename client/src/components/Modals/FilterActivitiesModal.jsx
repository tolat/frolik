import { useSelector } from "react-redux";
import styles from "./styles/FilterActivitiesModal.module.scss";
import ModalPortal from "./ModalPortal";
import SimpleInput from "../UI/SimpleInput";
import SimpleButton from "../UI/SimpleButton";
import { useEffect, useRef, useState } from "react";
import { hideModal } from "../../store/modal-actions";
import ModalHeaderPortal from "./ModalHeaderPortal";
import completeIcon from "../../images/complete.png";
import completeIconLight from "../../images/complete-light.png";
import creationIcon from "../../images/sketch.png";
import creationIconLight from "../../images/sketch-light.png";
import featuredIcon from "../../images/feature.png";
import featuredIconLight from "../../images/feature-light.png";
import { useT } from "../../i18n";

// "Show only" toggles — pick any number; an activity must match all of them
const SHOW_ONLY = [
  { key: "completed", labelKey: "filter.showOnly.completed", icon: completeIcon, iconOn: completeIconLight },
  { key: "featured", labelKey: "filter.showOnly.featured", icon: featuredIcon, iconOn: featuredIconLight },
  { key: "created", labelKey: "filter.showOnly.created", icon: creationIcon, iconOn: creationIconLight },
];

const FilterActivitiesModal = (props) => {
  const { t } = useT();
  const modalState = useSelector((state) => state.modal);
  const isOpen = modalState.selector === "filter-activities";
  const modalStyle = { display: isOpen ? "flex" : "none" };

  // Show-only toggles are live state; the number fields are read on Apply.
  // The inputs remount (key) whenever the sheet opens or is cleared, so they
  // always show the filter that is actually applied.
  const [showOnly, setShowOnly] = useState({});
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    setShowOnly({
      completed: !!props.filter?.completed,
      featured: !!props.filter?.featured,
      created: !!props.filter?.created,
    });
    setFormKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filterRefs = {
    maxParticipants: useRef(),
    minParticipants: useRef(),
    minRating: useRef(),
    maxCost: useRef(),
    minCost: useRef(),
    maxTime: useRef(),
  };

  const readFilter = () => {
    const filter = { ...props.initialActivityFilter?.filter, ...showOnly };
    for (let key in filterRefs) {
      filter[key] = filterRefs[key].current?.value ?? "";
    }
    return filter;
  };

  const toggle = (key) =>
    setShowOnly((prev) => ({ ...prev, [key]: !prev[key] }));

  function handleApplyFilter() {
    props.dispatchFilter({
      type: "apply-filter",
      active: true,
      filter: readFilter(),
    });
    hideModal();
  }

  function handleClearFilter() {
    props.dispatchFilter({
      type: "apply-filter",
      active: false,
      filter: props.initialActivityFilter?.filter,
    });
    hideModal();
  }

  const f = props.filter || {};

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <ModalHeaderPortal selector={"filter-activities"}>
          {t("filter.header")}
        </ModalHeaderPortal>

        <div className={styles.sectionLabel}>{t("filter.showOnly.title")}</div>
        <div
          className={styles.chips}
          role="group"
          aria-label={t("filter.showOnly.title")}
        >
          {SHOW_ONLY.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={!!showOnly[o.key]}
              onClick={() => toggle(o.key)}
              className={`${styles.chip} ${showOnly[o.key] ? styles.chipOn : ""}`}
            >
              <img src={showOnly[o.key] ? o.iconOn : o.icon} alt="" />
              {t(o.labelKey)}
            </button>
          ))}
        </div>

        <div className={styles.sectionLabel}>{t("filter.details")}</div>
        <div key={formKey} className={styles.fields}>
          <div className={styles.sideBySide}>
            <SimpleInput
              name={"min-participants"}
              label={t("filter.fields.minParticipants")}
              suffix={t("filter.units.people")}
              type="number"
              min={0}
              ref={filterRefs.minParticipants}
              defaultVal={f.minParticipants}
            />
            <div className={styles.spacer}></div>
            <SimpleInput
              name={"max-participants"}
              label={t("filter.fields.maxParticipants")}
              suffix={t("filter.units.people")}
              type="number"
              min={0}
              ref={filterRefs.maxParticipants}
              defaultVal={f.maxParticipants}
            />
          </div>
          <div className={styles.sideBySide}>
            <SimpleInput
              min={0}
              type={"number"}
              name={"min-cost"}
              label={t("filter.fields.minCost")}
              prefix="$"
              ref={filterRefs.minCost}
              defaultVal={f.minCost}
            />
            <div className={styles.spacer} />
            <SimpleInput
              min={0}
              type={"number"}
              name={"max-cost"}
              label={t("filter.fields.maxCost")}
              prefix="$"
              ref={filterRefs.maxCost}
              defaultVal={f.maxCost}
            />
          </div>
          <div className={styles.sideBySide}>
            <SimpleInput
              min={0}
              max={5}
              type={"number"}
              name={"min-rating"}
              label={t("filter.fields.minRating")}
              suffix="★"
              step={0.5}
              ref={filterRefs.minRating}
              defaultVal={f.minRating}
            />
            <div className={styles.spacer} />
            <SimpleInput
              min={0}
              max={24}
              type={"number"}
              name={"max-time"}
              label={t("filter.fields.maxTime")}
              suffix={t("filter.units.hours")}
              step={0.5}
              ref={filterRefs.maxTime}
              defaultVal={f.maxTime}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <SimpleButton
            onClick={handleClearFilter}
            className={styles.clearButton}
          >
            {t("filter.clearAll")}
          </SimpleButton>
          <SimpleButton
            onClick={handleApplyFilter}
            className={styles.applyButton}
          >
            {t("filter.apply")}
          </SimpleButton>
        </div>
      </div>
    </ModalPortal>
  );
};

export default FilterActivitiesModal;
