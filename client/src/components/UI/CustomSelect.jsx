import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/CustomSelect.module.scss";
import upIcon from "../../images/up.png";
import downIcon from "../../images/down.png";

const CustomSelect = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const [optionsDisplay, setOptionsDisplay] = useState("none");

  const handleSetDataChanged = (value) => {
    if (value !== props.defaultVal) {
      props.setDataChanged && props.setDataChanged(true);
    } else {
      props.setDataChanged && props.setDataChanged(false);
    }
  };

  const handleChange = (o) => {
    handleToggleOptions();
    setValue(o.name);
    handleSetDataChanged(o.name);
  };

  const handleToggleOptions = () => {
    setOptionsDisplay((prevState) => {
      return prevState === "none" ? "block" : "none";
    });
  };

  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div className={`${styles.container} ${props.className}`}>
      <label className={styles.label} htmlFor={`${props.name}-select`}>
        {props.label}
      </label>
      <div
        tabIndex={"0"}
        onBlur={() => {
          setOptionsDisplay("none");
        }}
        className={styles.select}
        name={props.name}
        id={`${props.name}-select`}
      >
        <div onClick={handleToggleOptions} className={styles.valueContainer}>
          <div ref={ref} className={styles.value}>
            {value}
          </div>
          <img
            className={styles.arrow}
            style={{ display: optionsDisplay === "block" ? "none" : "block" }}
            src={downIcon}
            alt="select-arrow"
          />
          <img
            className={styles.arrow}
            style={{ display: optionsDisplay === "block" ? "block" : "none" }}
            src={upIcon}
            alt="select-arrow"
          />
        </div>

        <div
          style={{ display: optionsDisplay }}
          className={styles.optionsContainer}
        >
          {props.options.map((o) => (
            <div
              key={Math.random()}
              onClick={
                o.selectable
                  ? () => {
                      handleChange(o);
                    }
                  : null
              }
              className={`${styles.optionContainer} ${
                o.selectable ? null : styles.unselectable
              }`}
            >
              {o.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default CustomSelect;
