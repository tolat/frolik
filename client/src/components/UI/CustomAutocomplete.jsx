import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/CustomAutocomplete.module.scss";

const CustomAutocomplete = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const [showOptions, setShowOptions] = useState(false);

  const handleSetDataChanged = (value) => {
    if (value !== props.defaultVal) {
      props.setDataChanged && props.setDataChanged(true);
    } else {
      props.setDataChanged && props.setDataChanged(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(e.target.value);
    handleSetDataChanged(newValue);
    setShowOptions(true);
  };

  const handleSelectCity = (o) => {
    const newValue = `${o.name}, ${o.country}`;
    setValue(newValue);
    handleSetDataChanged(newValue);
    setShowOptions(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 100);
  };

  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div className={`${styles.container} ${props.className}`}>
      <label className={styles.label} htmlFor={`${props.name}-autocomplete`}>
        {props.label}
      </label>
      <input
        onFocus={() => {
          setShowOptions(true);
        }}
        onBlur={handleInputBlur}
        name={props.name}
        id={`${props.name}-select`}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={styles.input}
      />
      {!showOptions || !value || value.length < 2 ? null : (
        <div
          id="city-select-options-container"
          className={styles.optionsContainer}
        >
          {props.options &&
            props.options
              .filter((o) =>
                o.name
                  .toLowerCase()
                  .includes(
                    value.slice(0, value.indexOf(",") || "").toLowerCase()
                  )
              )
              .map((o) => (
                <div
                  key={Math.random()}
                  onClick={() => {
                    handleSelectCity(o);
                  }}
                  className={styles.optionContainer}
                >
                  {o.name}, {o.country}
                </div>
              ))}
        </div>
      )}
    </div>
  );
});

export default CustomAutocomplete;
