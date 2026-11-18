import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/CustomSelect.module.scss";
import upIcon from "../../images/up.png";
import downIcon from "../../images/down.png";
import { useT } from "../../i18n";

// Option names are shown through the shared category labels when they are
// categories (others fall back to the name); the raw name is what is stored.

const CustomSelect = forwardRef((props, ref) => {
  const { tOr } = useT();
  const [value, setValue] = useState(props.defaultVal);
  const [optionsDisplay, setOptionsDisplay] = useState("none");

  const handleChange = (o) => {
    handleToggleOptions();
    setValue(o.name);
    props.setDataChanged && props.setDataChanged(o.name);
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
      {props.label ? (
        <label className={styles.label} htmlFor={props.id}>
          {props.label}
        </label>
      ) : null}
      <div
        tabIndex={"0"}
        onBlur={() => {
          setOptionsDisplay("none");
        }}
        className={styles.select}
        name={props.name}
      >
        <div
          id={props.id}
          onClick={handleToggleOptions}
          className={styles.valueContainer}
        >
          <div id={props.id} ref={ref} className={styles.value}>
            {value ? tOr("data.categories." + value, value) : value}
          </div>
          <img
            className={styles.arrow}
            style={{ display: optionsDisplay === "block" ? "none" : "block" }}
            src={downIcon}
            alt=""
          />
          <img
            className={styles.arrow}
            style={{ display: optionsDisplay === "block" ? "block" : "none" }}
            src={upIcon}
            alt=""
          />
        </div>

        <div
          style={{ display: optionsDisplay }}
          className={styles.optionsContainer}
        >
          {props.options &&
            props.options.map((o) => (
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
                {o.component || <Option option={o}></Option>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

const Option = (props) => {
  const { tOr } = useT();
  return (
    <div
      className={`${styles.optionComponentContainer} ${
        props.option.unselectable ? styles.unselectable : null
      }`}
    >
      <div className={styles.name}>
        {tOr("data.categories." + props.option.name, props.option.name)}
      </div>
      {props.option.details && (
        <div className={styles.details}>{props.option.details}</div>
      )}
    </div>
  );
};

export default CustomSelect;
